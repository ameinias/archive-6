
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import Dexie from 'dexie';
import { db } from '../utils/db'; // import the database
import 'dexie-export-import'; // Import the export/import addon



const handleExport = async () => {
  try {
    // Ensure the export function is available
    if (typeof db.export !== 'function') {
      throw new Error('dexie-export-import addon not properly loaded');
    }
    const blob = await db.export({ prettyJson: true });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "dexie-export.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('' + error);
  }
};


const handleImport = async (file) => {
  try {
    if (!file) throw new Error(`Only files can be dropped here`);
    console.log("Importing " + file.name);

    // Close the current database
    await db.close();

    // Delete the current database
    await db.delete();

    // Import the file and get the new database instance
    const importedDb = await Dexie.import(file, {
      progressCallback: (progress) => {
        console.log(`Import progress: ${progress.completedRows}/${progress.totalRows} rows`);
      }
    });

    console.log("Import complete");

    // Reopen the original database to refresh it
    await db.open();

  } catch (error) {
    console.error('Import error:', error);
    // Try to reopen the database even if import failed
    try {
      await db.open();
    } catch (reopenError) {
      console.error('Failed to reopen database:', reopenError);
    }
  }
};

const handleDragOver = (event) => {
  event.stopPropagation();
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
};

const handleFileInputChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    handleImport(file);
  }
};

const handleDrop = async (event) => {
  event.stopPropagation();
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  await handleImport(file);
};



function ImportExport() {


  return (
    <>
      <h3>Database Info</h3>
      <span>Various database related tasks.
      </span>
      <br/>
      <div className="row align-items-start databasetable">
        <div className="col"><b>Current Database: </b>{db.name}</div>
        <div className="col"><b>Version:</b> {db.verno}</div>
      </div>
      <div className="row align-items-start databasetable">
        <div className="col">

  <Button variant="primary" className="mt-3" onClick={handleExport}>Export Database</Button>


    <input
      type="file"
      accept=".json"
      onChange={handleFileInputChange}
      style={{ display: 'none' }}
      id="fileInput"
    />
    <Button
      variant="primary"
      onClick={() => document.getElementById('fileInput').click()}
    >
      Import Database
    </Button>

    <span>OR</span>

        <div id="dropzone" className="dropzone"
             onDragOver={handleDragOver}
             onDrop={handleDrop}>
          Drop dexie export JSON file here
        </div>
      </div><div className="col">

        <table border="1">
          <thead></thead>
          <tbody></tbody>
        </table>
        <div>
          TODO:
          <ul>
            <li>☑ Get a database read/write/edit working</li>
            <li>☐ Update Full with new entries only</li>
            <li>☐ Create New, Full and Current databases</li>
            <li>☐ Switch between New, Full and Current databases</li>
            <li>☐ Set Current Database to 'New'</li>
          </ul>
        </div>
      </div>
      </div>



{/*<Button variant="primary" className="mt-3" onClick={handleClear}>Clear Database</Button>  */}
     </>
  )
}

export default ImportExport




