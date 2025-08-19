import Dexie, { type EntityTable } from 'dexie';
import { categories, subCategories,researcherIDs } from "./constants.js";
import "dexie-export-import";


type Category = keyof typeof categories;
type SubCategory = keyof typeof subCategories;
type ResearcherID = keyof typeof researcherIDs;

interface dbMainEntry {
  id: number; //real id
  fauxID: string;  // Fake ID seen by the player - sometimes multiple entries have the same will share because they have changing game states.
  hexHash: string; // Eventually used to pull from the other database
  title: string;
  description: string;
  media?: File[];
  category: string;
  // Remove subItems array - we'll query subentries by parentId instead
  date?: Date;
  entryDate: Date;
  available: boolean; //  field to indicate availability
  availableOnStart: boolean; //  field to indicate if available on start
  template: string; // Optional field for template
  bookmark?: boolean;
}

interface dbSubEntry {
  id: number; //real id
  fauxID: string;  // Fake ID seen by the player - sometimes multiple entries have the same will share because they have changing game states.
  hexHash: string; // Eventually used to pull from the other database
  title: string;
  description?: string;
  mediaSub?: string;
  researcherID: ResearcherID; // researcher who added the entry
  subCategory: string;
  date?: Date;
  entryDate: Date;
  parentId: number; // Changed to number to match the main entry's id
  available: boolean; //  field to indicate availability
  availableOnStart: boolean; //  field to indicate if available on start
  template: string; // Optional field for template
  bookmark?: boolean;
}


// This is for search and bookmark results
interface bothEntries { 
  id: number; // id of search database
  origin: number; // index in og datrabase
  fauxID: string;  // Fake ID seen by the player - sometimes multiple entries have the same will share because they have changing game states.
  title: string;
  date?: Date;
  type: 'main' | 'sub'; // Type to distinguish between main and sub entries
  parentId?: number; // Include parentId for subentries
}

const db = new Dexie('gb-current') as Dexie & {
  friends: EntityTable<
    dbMainEntry,
    'id' 
  >;
  subentries: EntityTable<
    dbSubEntry,
    'id' 
  >;
  export: (options?: any) => Promise<Blob>;
  import: (blob: Blob, options?: any) => Promise<Dexie>;
};



// Schema declaration:
db.version(1).stores({
  friends: '++id, fauxID, title, description, media, category, date, entryDate, available, availableOnStart, template', // Removed subItems
  subentries: '++id, fauxID, title, description, mediaSub, subCategory, date, entryDate, researcherID, parentId, available, availableOnStart, template' // Fixed spelling and added parentId index
});



// Helper functions for working with entries and subentries
const dbHelpers = {
  // Get a main entry with all its subentries
  async getEntryWithSubentries(entryId: number) {
    const entry = await db.friends.get(entryId);
    if (!entry) return null;

    const subentries = await db.subentries.where('parentId').equals(entryId).toArray();
    return {
      ...entry,
      subentries
    };
  },



  // Get all subentries for a main entry
  async getSubentriesForEntry(entryId: number) {
    return await db.subentries.where('parentId').equals(entryId).toArray();
  },

  // Add a new main entry
  async addMainEntry(entry: Omit<dbMainEntry, 'id'>) {
    return await db.friends.add(entry);
  },

  // Add a new subentry linked to a main entry
  async addSubentry(subentry: Omit<dbSubEntry, 'id'>) {
    return await db.subentries.add(subentry);
  },

  // Delete a main entry and all its subentries
  async deleteEntryWithSubentries(entryId: number) {
    await db.subentries.where('parentId').equals(entryId).delete();
    await db.friends.delete(entryId);
  },
    async isEmpty() {
    const count = await db.friends.count();
    return count === 0;
  },

   async importFromBlob(blob: Blob): Promise<void> {
    await db.close();
    await db.delete();
    
    await Dexie.import(blob, {
      progressCallback: (progress) => {
        console.log(`Import progress: ${progress.completedRows}/${progress.totalRows} rows`);
      },
    });
    
    await db.open();
  },

  async exportToBlob(): Promise<Blob> {
    return await db.export();
  },

};





export type { dbMainEntry, dbSubEntry, bothEntries };
export { db, dbHelpers };




