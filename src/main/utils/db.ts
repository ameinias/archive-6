import Dexie, { type EntityTable } from 'dexie';
import { categories, subCategories } from "./constants.js";


type Category = keyof typeof categories;
type SubCategory = keyof typeof subCategories;

interface dbMainEntry {
  id: number; //real id
  fauxID: string;  // Fake ID seen by the player - sometimes multiple entries have the same will share because they have changing game states. 
  hexHash: string; // Eventually used to pull from the other database
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  subItems: dbSubEntry[];
  date?: Date;
  entryDate: Date;
}

interface dbSubEntry {
  id: number; //real id
  fauxID: string;  // Fake ID seen by the player - sometimes multiple entries have the same will share because they have changing game states. 
  hexHash: string; // Eventually used to pull from the other database
  title: string;
  description: string;
  media: string;
  subCategory: string;
    date?: Date;
  entryDate: Date;
}

const db = new Dexie('gb-current') as Dexie & {
  friends: EntityTable<
    dbMainEntry,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  friends: '++id, title, description, thumbnail, category, subItems, date, entryDate' // primary key "id" (for the runtime!)
});




export type { dbMainEntry };
export { db };




