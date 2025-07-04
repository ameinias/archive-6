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



// Start                          --------------------------------v 


  // Configure exportLink
  // exportLink.onclick = async ()=>{
//     try {
//       const blob = await db.export({prettyJson: true, progressCallback});
//       download(blob, "dexie-export.json", "application/json");
//     } catch (error) {
//  console.error(''+error);
//     }
//   };


// //
// // When document is ready, bind export/import funktions to HTML elements
// //
// document.addEventListener('DOMContentLoaded', ()=>{
//   showContent().catch(err => console.error(''+err));
//   const dropZoneDiv = document.getElementById('dropzone');
//   const exportLink = document.getElementById('exportLink');



//   // Configure dropZoneDiv
//   dropZoneDiv.ondragover = event => {
//     event.stopPropagation();
//     event.preventDefault();
//     event.dataTransfer.dropEffect = 'copy';
//   };

//   // Handle file drop:
//   dropZoneDiv.ondrop = async ev => {
//     ev.stopPropagation();
//     ev.preventDefault();

//     // Pick the File from the drop event (a File is also a Blob):
//     const file = ev.dataTransfer.files[0];
//     try {
//       if (!file) throw new Error(`Only files can be dropped here`);
//       console.log("Importing " + file.name);
//       await db.delete();
//       db = await Dexie.import(file, {
//         progressCallback
//       });
//       console.log("Import complete");
//       await showContent();
//     } catch (error) {
//       console.error(''+error);
//     }
//   }
// });

// function progressCallback ({totalRows, completedRows}) {
//   console.log(`Progress: ${completedRows} of ${totalRows} rows completed`);
// }

// async function showContent() {
//   const tbody = document.getElementsByTagName('tbody')[0];
 
//   const tables = await Promise.all(db.tables.map (async table => ({
//     name: table.name,
//     count: await table.count(),
//     primKey: table.schema.primKey.src
//   })));
//   tbody.innerHTML = `
//     <tr>
//       <th>Database Name</th>
//       <td colspan="2">${db.name}</th>
//     </tr>
//     ${tables.map(({name, count, primKey}) => `
//       <tr>
//         <th>Table: "${name}"</th>
//         <td>Primary Key: ${primKey}</td>
//         <td>Row count: ${count}</td>
//       </tr>`)}
//   `;
// }


// END                          --------------------------------v 



export type { dbMainEntry };
export { db };




