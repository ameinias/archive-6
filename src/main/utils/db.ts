import Dexie, { type EntityTable } from 'dexie';
import { categories, subCategories } from "./constants.js";


type Category = keyof typeof categories;
type SubCategory = keyof typeof subCategories;

interface dbMainEntry {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  category: Category;
  subItems: dbSubEntry[];
  date?: Date;
  entryDate: Date;
}

interface dbSubEntry {
  id: number;
  title: string;
  description: string;
  media: string;
  subCategory: SubCategory;
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