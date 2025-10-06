import Dexie from 'dexie';
import { categories, subCategories,researcherIDs,hexHashes } from "./constants.js";
import "dexie-export-import";
import {setStartAvalability} from "../../hooks/dbHooks.js"




export const db = new Dexie('gb-current');



// Schema declaration:
db.version(1).stores({
  friends: '++id, fauxID, title, description, media, category, date, entryDate, available, availableOnStart, template, unread', // Removed subItems
  subentries: '++id, fauxID, title, description, mediaSub, subCategory, date, entryDate, researcherID, parentId, available, availableOnStart, template,unread' // Fixed spelling and added parentId index
});

// version 2
db.version(2).stores({
  friends: '++id, fauxID, title, description, media, category, date, entryDate, available, availableOnStart, template, unread, hexHash', // Removed subItems
  subentries: '++id, fauxID, title, description, mediaSub, subCategory, date, entryDate, researcherID, parentId, available, availableOnStart, template,unread, hexHash' // Fixed spelling and added parentId index
});

// version 3  -  dublin core inspo https://www.dublincore.org/resources/userguide/creating_metadata/
db.version(3).stores({
  friends: '++id, fauxID, title, description, media, category, date, displayDate, available, availableOnStart, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes', // Removed subItems
  subentries: '++id, fauxID, title, description, mediaSub, subCategory, date, displayDate, researcherID, parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes', // Fixed spelling and added parentId index
  attachments: '++id, parentId, fileName, fileType, filePath'
});



// Helper functions for working with entries and subentries. Some of these have switched to hooks in src/hooks/dbhooks.js
export const dbHelpers = {

  // Add a new main entry
  async addMainEntry(entry) {
    return await db.friends.add(entry);
  },

  // Add a new subentry linked to a main entry
  async addSubentry(subentry) {
    return await db.subentries.add(subentry);
  },

  // Delete a main entry and all its subentries
  async deleteEntryWithSubentries(entryId) {
    await db.subentries.where('parentId').equals(entryId).delete();
    await db.friends.delete(entryId);
  },
    async isEmpty() {
    const count = await db.friends.count();
    return count === 0;
  },

   async importFromBlob(blob) {
    await db.close();
    await db.delete();

    await Dexie.import(blob, {
      progressCallback: (progress) => {
        console.log(`Import progress: ${progress.completedRows}/${progress.totalRows} rows`);
      },
    });

    await db.open();
  },

  async exportToBlob() {
    return await db.export();
  },


  // Helper function to convert IDs to names for display. Gets possibly an array from an entry and returns their readable name.
 getHexHashNamesFromIds(ids) {
    return ids.map(id => {
        const hash = hexHashes.find(h => h.id === id);
        console.log("getHexHashNamesFromIds", id, hash ? hash.name : "no");
        return hash ? hash.name : id;
    });
},


 getIdsFromHexHashes(code) {


        const hash = hexHashes.find(h => h.hexHashcode === code);
        console.log("getIdsFromHexHashes id: ", code, hash ? hash.id : "hash not found");
        return hash ? hash.id : code;
},

 getHexHashIds(value) {
    // keep ids
    if (Array.isArray(value) && value.every(v => typeof v === 'number')) {
        return value;
    }
    // turn names into ids
    if (Array.isArray(value)) {
        return value.map(name => {
            const hash = hexHashes.find(h => h.name === name);
            return hash ? hash.id : name;
        });
    }
    return [value];
},

/////////////////////////////////////////////////


};



export const saveAsDefaultDatabase = async () => {
  try {
    {await setDefaultParameters(); }
    const blob = await db.export({ prettyJson: true });


    const content = await blob.text();

    await window.electronAPI.saveAssetFile(
      'assets/databases/dexie-import.json',
      content
    );


    const fullPath = await window.electronAPI.getAssetPath('databases/dexie-import.json');
    console.log('Database saved successfully to:', fullPath);

          // await window.electronAPI.showAlert(`Make sure you are also saving into the VS code project, to assets/databases/dexie-import.json.`);


   console.log('Database saved successfully to:', fullPath);


  } catch (error) {
    console.error('Error saving default database:', error);
  }
};

export const newGame = async () => {
  try {
    // called main.js to set up the database in AppData
    const userDbPath = await window.electronAPI.setupUserDatabase();


    const relativePath = 'assets/databases/dexie-import.json';
    const fileContents = await window.electronAPI.readAssetFile(
      relativePath
    );

    await dbHelpers.importFromBlob(
      new Blob([fileContents], { type: 'application/json' }),
    );

    await setDefaultParameters();


    console.log('New game started successfully! ' + userDbPath);
  } catch (error) {
    console.error('Error starting new game:', error);
  }
};

export const setDefaultParameters = async () =>
{
  try{



      await setStartAvalability();

    await db.subentries.toCollection().modify({ bookmark: false });
    await db.friends.toCollection().modify({ bookmark: false });

    await db.subentries.toCollection().modify({ unread: true });
    await db.friends.toCollection().modify({ unread: true });

      } catch (error) {
    return "Error.";
  }
}

export const newGameWithWarning = async () => {
  if (await window.electronAPI.showConfirm('Starting a new game will delete all current database entries. Proceed anyway?')) {
    await newGame();
  }








};

// export { dbMainEntry, dbSubEntry, bothEntries, User };
