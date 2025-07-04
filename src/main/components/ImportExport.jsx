
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../utils/db'; // import the database



const handleExport = async () => {
  try {
    const blob = await db.export({ prettyJson: true });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download(blob, "dexie-export.json", "application/json");
    // document.body.appendChild(a);
    // a.click();
    // a.remove();
    // URL.revokeObjectURL(url);
  } catch (error) {
    console.error('' + error);
  }
};


// const handleImport = async () => {
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
//   };



function ImportExport() {


  return (
    <>
      <div class="column"><p>
        <a id="exportLink" href="#">Click here to export the database</a>
      </p>
        <div id="dropzone">
          Drop dexie export JSON file here
        </div>
      </div><div class="column">
        <h3>Database Info</h3>
        <table border="1">
          <thead></thead>
          <tbody></tbody>
        </table>
      </div>

  <Button variant="primary" className="mt-3" onClick={handleExport}>Export Database</Button> 
{/* <Button variant="primary" className="mt-3" onClick={handleImport}>Import Database</Button> 
<Button variant="primary" className="mt-3" onClick={handleClear}>Clear Database</Button>  */}
     </>
  )
}

export default ImportExport




