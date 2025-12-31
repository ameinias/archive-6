import Dexie from "dexie";
import {
  categories,
  subCategories,
  researcherIDs,
  hexHashes,
} from "./constants.js";
import "dexie-export-import";
import { setStartAvalability } from "../hooks/dbHooks.js";
import { eventManager } from "@utils/events";
import { updateGameState } from "./gamelogic.js";
import { Link } from "react-router-dom";

export const db = new Dexie("gb-current");

//##region Database Schema Versions
// Schema declaration:
db.version(1).stores({
  friends:
    "++id, fauxID, title, description, media, category, date, entryDate, available, availableOnStart, template, unread", // Removed subItems
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, entryDate, researcherID, parentId, available, availableOnStart, template,unread", // Fixed spelling and added parentId index
});

// version 2
db.version(2).stores({
  friends:
    "++id, fauxID, title, description, media, category, date, entryDate, available, availableOnStart, template, unread, hexHash", // Removed subItems
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, entryDate, researcherID, parentId, available, availableOnStart, template,unread, hexHash", // Fixed spelling and added parentId index
});

// version 3  -  dublin core inspo https://www.dublincore.org/resources/userguide/creating_metadata/
db.version(3).stores({
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, availableOnStart, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes", // Removed subItems
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, displayDate, researcherID, parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes", // Fixed spelling and added parentId index
  attachments: "++id, parentId, fileName, fileType, filePath",
});

// version 3  -  dublin core inspo https://www.dublincore.org/resources/userguide/creating_metadata/
db.version(4).stores({
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, availableOnStart, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes", // Removed subItems
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, displayDate, researcherID, parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes", // Fixed spelling and added parentId index
  media: "++id, name, type, size, blob, uploadedAt",
});

db.version(4).stores({
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, availableOnStart, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes", // Removed subItems
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, displayDate, researcherID, parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes", // Fixed spelling and added parentId index
  media: "++id, name, type, size, path, uploadedAt",
});

db.version(4.5).stores({
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, availableOnStart, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes", // Removed subItems
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, displayDate, researcherID, parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes", // Fixed spelling and added parentId index
  media: "++id, name, type, size, path, uploadedAt",
});

// no hyphens
db.version(4.6).stores({
  gamedata: "expVersion, uploadedAt",
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, availableOnStart, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes", // Removed subItems
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, displayDate, researcherID, parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes", // Fixed spelling and added parentId index
  media: "++id, name, type, size, path, uploadedAt",
});

// get rid of available on start
db.version(4.7).stores({
  gamedata: "expVersion, uploadedAt",
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes",
  subentries:
    "++id, fauxID, title, description, mediaSub, subCategory, date, displayDate, researcherID, parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes",
  media: "++id, name, type, size, path, uploadedAt",
});

// remove researcher id and fix some ID stuff for subentries
db.version(4.8).stores({
  gamedata: "expVersion, uploadedAt",
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes",
  subentries:
    "++id, fauxID, parentFauxID, subID, title, description, mediaSub, subCategory, date, displayDate,  parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes",
  media: "++id, name, type, size, path, uploadedAt",
});

//add related and triggerEvent
db.version(4.9).stores({
  gamedata: "expVersion, uploadedAt, sessionStart",
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes, triggerEvent",
  subentries:
    "++id, fauxID, parentFauxID, subID, title, description, mediaSub, subCategory, date, displayDate,  parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes, related, triggerEvent",
  media: "++id, name, type, size, path, uploadedAt",
});

//add entryRef
db.version(5.0).stores({
  gamedata: "expVersion, uploadedAt, sessionStart",
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes, triggerEvent, entryRef",
  subentries:
    "++id, fauxID, parentFauxID, subID, title, description, mediaSub, subCategory, date, displayDate,  parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes, related, triggerEvent, entryRef",
  media: "++id, name, type, size, path, uploadedAt",
});

//add new database for events
db.version(5.1).stores({
  gamedata: "expVersion, uploadedAt, sessionStart",
  friends:
    "++id, fauxID, title, description, media, category, date, displayDate, available, template, unread, hexHash, related, modEditDate, modEdit, lastEditedBy, devNotes, triggerEvent, entryRef",
  subentries:
    "++id, fauxID, parentFauxID, subID, title, description, mediaSub, subCategory, date, displayDate,  parentId, available, template, unread, hexHash, modEditDate, modEdit, lastEditedBy, devNotes, related, triggerEvent, entryRef",
  media: "++id, name, type, size, path, uploadedAt",
  events: "++id, name, type, timestamp",
});



//#endregion

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

  async addEvent(eventName) {
    return await db.events.add(
     { name: eventName,
      type: "default", 
      timestamp: new Date()}
    );
  },

    async clearEvents() {
    return await db.events.clear();
  },

  async getExpectedDBVersion() {
    // check if the currently loaded database is
  },

  async GetDBVersion() {
    return db.verno;
  },

  // Delete a main entry and all its subentries
  async deleteEntryWithSubentries(entryId) {
    await db.subentries.where("parentId").equals(entryId).delete();
    await db.friends.delete(entryId);
  },
  async isEmpty() {
    const count = await db.friends.count();
    return count === 0;
  },

  //depreciated
  async importFromBlob(blob) {
    await db.close();
    await db.delete();

    await Dexie.import(blob, {
      progressCallback: (progress) => {
        console.log(
          `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
        );
      },
    });

    await db.open();
  },

  async exportToBlob() {
    return await db.export();
  },

  // Helper function to convert IDs to names for display. Gets possibly an array from an entry and returns their readable name.
  getHexHashNamesFromIds(ids) {
    // Handle null/undefined
    if (!ids) return [];

    // Convert single value to array
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    return ids.map((id) => {
      // Convert to string/number for comparison if needed
      const hash = hexHashes.find(
        (h) => h.id == id || h.id === String(id) || h.id === Number(id),
      );
      console.log("getHexHashNamesFromIds", id, hash ? hash.name : "not found");
      return hash ? hash.name : `Unknown (${id})`;
    });
  },

  getHexHashCodesFromIds(ids) {
    // Handle null/undefined
    if (!ids) return [];

    // Convert single value to array
    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    return ids.map((id) => {
      // Convert to string/number for comparison if needed
      const hash = hexHashes.find(
        (h) => h.id == id || h.id === String(id) || h.id === Number(id),
      );
      // console.log(
      //   "getHexHashCodesFromIds",
      //   id,
      //   hash ? hash.hexHashcode : "not found",
      // );
      return hash ? hash.hexHashcode : `Unknown (${id})`;
    });
  },

  getIdsFromHexHashes(code) {
    const hash = hexHashes.find((h) => h.hexHashcode === code);
    console.log(
      "getIdsFromHexHashes id: ",
      code,
      hash ? hash.id : "hash not found",
    );
    return hash ? hash.id : code;
  },

  getHexHashIds(value) {
    // keep ids
    if (Array.isArray(value) && value.every((v) => typeof v === "number")) {
      return value;
    }
    // turn names into ids
    if (Array.isArray(value)) {
      return value.map((name) => {
        const hash = hexHashes.find((h) => h.name === name);
        return hash ? hash.id : name;
      });
    }
    return [value];
  },

  generateTitle(item) {
    if (item === null) return;

    let bar;
    
            if(item.title != "") bar =  " | ";
           else bar =  "";

    let theTitle;

    if (item.type === "entry") {
      // main entry
      theTitle = item.fauxID + bar + item.title;
    } else {
      if (item.subCategory != "MetaData" && item.subCategory) {




        theTitle = item.fauxID + " | " + item.subCategory + bar + item.title ;
      } else {
        theTitle = item.fauxID + bar +  item.title;
      }
    }

    return theTitle;
  },

//   urlDirect(item) {
//     let url;

//     if (item.type === "entry") {
//       url = !gameLog.isAdmin ? "entry" : "edit-item";
//     } else {
//       url = "edit-subitem";
//     }

//     return url;
//   },

//   generateEntryLink(item) {

//     const URL = urlDirect(item);

//     if (item.type === "sub") {
//       return (
//         <>
//           <div className="tab"></div>
//           <Link to={`/${URL}/${item.parentId}/`}>
//             {dbHelpers.generateTitle(item)}
//           </Link>
//         </>
//       );
//     } else {
//       return (
//         <>
//           <Link
//             to={`/${URL}/${item.origin}`}
//             className="log-parent-title"
//           >
//             {dbHelpers.generateTitle(item)} sdfsdf fsd sfsd
//           </Link>
//         </>
//       );
//     }
//   },
 };

export const handleJSONExport = async (fileName = "dexie-export-web.json") => {
  try {
    // Ensure the export function is available

    // Not working for now. Plan to use to
    // reset the DB if the assets/databases/dexie-import.json is a newer version than current.
    //UpdateDBCount();

    if (typeof db.export !== "function") {
      throw new Error("dexie-export-import addon not properly loaded");
    }
    const blob = await db.export({ prettyJson: true });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    console.log("Export complete");
    setStatusMessage("Export started, check your downloads folder.");
  } catch (error) {
    console.error("" + error);
  }
};

export const saveAsDefaultDatabase = async () => {
  try {
    {
      await setDefaultParameters();
    }
    const blob = await db.export({ prettyJson: true });

    const content = await blob.text();

    // doesn't seem to be updating app data right now
    await eventManager.saveAssetFile(
      "assets/databases/dexie-import.json",
      content,
    );

    const fullPath = await eventManager.getAssetPath(
      "databases/dexie-import.json",
    );
    console.log("Database saved successfully to:", fullPath);
  } catch (error) {
    console.error("Error saving default database:", error);
  }
};

// eventually will need a way to list entries by modEditDate - that is what is saving when entries were unlocked.
export const exportTelemetrisToAppData = async (username) => {
  try {
    const blob = await db.export({ prettyJson: true });

    const content = await blob.text();

    const now = new Date();

    // Get date string and replace slashes with hyphens
    const datePart = now.toLocaleDateString().replace(/\//g, "-");

    // Get time string
    const timePart = now.toLocaleTimeString().replace(/:/g, "-");

    const combined = `${datePart} ${timePart}`;

    console.log(combined);
    // Example output (en-US locale): "12-3-2025 7:51:00 PM"

    const filename = "telemetrics-" + username + "-" + combined + ".json";

    // doesn't seem to be updating app data right now
    await eventManager.saveTelemetricsFile(filename, content);
    console.log("Telemetrics saved successfully to AppData as:", filename);
  } catch (error) {
    console.error("Error saving telemetrics:", error);
  }
};

export const newGame = async (startHash) => {
  try {
    // called main.js to set up the database in AppData

    // takes resources db to appdata db
    const userDbPath = await eventManager.setupUserDatabase();

    const relativePath = "assets/databases/dexie-import.json";
    const fileContents = await eventManager.readAssetFile(relativePath);

    await db.close();
    await db.delete();

    await Dexie.import(new Blob([fileContents], { type: "application/json" }), {
      progressCallback: (progress) => {
        console.log(
          `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
        );
      },
    });

    await db.open();

    // TODO this doesn't seem to be working yet. iF FACT IT BREAKS THE APP IF UNCOMMENTED. i'LL DEAL WIH THIS LATER.
    // await db.gamedata.put({
    //     sessionStart: new Date(),
    //   });

    // reset states
    await setStartAvalability(startHash);
    await setDefaultParameters();
    updateGameState("editAccess", false);

    // window.location.reload(); // this did wrk to force datastate refresh

    console.log("New game started successfully! " + userDbPath);
    return true;
  } catch (error) {
    console.error("Error starting new game:", error);
  }
};

export const setDefaultParameters = async () => {
  try {
    await db.subentries.toCollection().modify({ bookmark: false });
    await db.friends.toCollection().modify({ bookmark: false });

    await db.subentries.toCollection().modify({ unread: true });
    await db.friends.toCollection().modify({ unread: true });
  } catch (error) {
    return "Error.";
  }
};

export const newGameWithWarning = async (startHash) => {
  if (
    await eventManager.showConfirm(
      "Starting a new game will delete all current database entries. Proceed anyway?",
    )
  ) {
    await newGame(startHash);
  }
};

export const importHashff = async (hashValue) => {
  const hexHashID = dbHelpers.getIdsFromHexHashes(hashValue);
  console.log("find you doing something " + hexHashID);
};

export const importHash = async (hashValue) => {
  const hexHashID = dbHelpers.getIdsFromHexHashes(hashValue);

  console.log(hashValue, "  ===================== ", hexHashID);

  const foundItems = db.friends?.filter((item) => {
    if (Array.isArray(item.hexHash)) {
      return item.hexHash.includes(hexHashID);
    }
    return parseInt(item.hexHash) === hexHashID;
  });

  const foundSubItems = db.subentries?.filter((item) => {
    if (Array.isArray(item.hexHash)) {
      return item.hexHash.includes(hexHashID);
    }

    if (item.hexHash === hexHashID) {
      console.log("found subitem with hex: ", item.title);
    } else {
      console.log(
        "not found subitem with hex: ",
        item.title,
        item.hexHash,
        hexHashID,
      );
    }

    return item.hexHash === hexHashID;
  });
  console.log(hashValue + " fff " + foundSubItems.length);
  return;

  foundItems.map((item) => {
    db.friends.update(item.id, {
      available: true,
      modEditDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      modEdit: "migrated",
    });
  });

  foundSubItems.map((item) => {
    db.subentries.update(item.id, {
      available: true,
      modEditDate: new Date().toISOString().replace("T", " ").substring(0, 19),
      modEdit: "migrated",
    });
  });

  const message = `Hash: ${hashValue} | ${dbHelpers.getIdsFromHexHashes(
    hashValue,
  )} | Entries unlocked: ${foundItems.length} | Subentries unlocked: ${
    foundSubItems.length
  }`;

  //  const result = await findByHashAndUnLock(hashValue);
  //   console.log(result);
  eventManager.showAlert(message);
  // setHashVal(''); // Clear input field after import
  //  hashInput = '';
};

// export { dbMainEntry, dbSubEntry, bothEntries, User };
