import { Button } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import Dexie from 'dexie';
import {
  db,
  dbHelpers,
  newGameWithWarning,
  saveAsDefaultDatabase,
} from '../../utils/db'; // import the database
import 'dexie-export-import'; // Import the export/import addon
import { GameLogic } from '../../utils/gamelogic';
// import { clear } from 'console';
import HashImport from './HashImport';
import { useLiveQuery } from 'dexie-react-hooks';

function ImportExport() {
  const { isAdmin, toggleAdmin, setStatusMessage } = GameLogic();
  const [toggleHelp, setToggleHelp] = useState(false);

  const notHookedUp = () => {
    // Placeholder so links can be made
    console.log('This feature is not hooked up yet. Please check back later.');
  };

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
      a.download = 'dexie-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      console.log('Export complete');
      setStatusMessage('Export started, check your downloads folder.');
    } catch (error) {
      console.error('' + error);
    }
  };

  const handleExportBlob = async () => {
    try {
      // Ensure the export function is available
      if (typeof db.export !== 'function') {
        throw new Error('dexie-export-import addon not properly loaded');
      }
      const blob = await db.export({ prettyJson: true });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dexie-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      console.log('Export complete');
      setStatusMessage('Export started, check your downloads folder.');
    } catch (error) {
      console.error('' + error);
    }
  };

  const clearDatabase = async () => {
    setStatusMessage('Attempting to reset the database...');

    if (
      !window.confirm(`This will delete all current database entries. You may want to make a backup first. Proceed anyway?
      `)
    ) {
      console.log('no');
      return;
    }
    await db.close();
    await db.delete();
    db.open();
  };

  const startOnAvailable = async () => {
    const subentries = await db.subentries.toArray();
    for (const entry of subentries) {
      console.log(
        `Updated subentry ${entry.id} to available: ${entry.available}`,
      );
      if (entry.availableOnStart)
        await db.subentries.update(entry.id, { available: true });
      else await db.subentries.update(entry.id, { available: false });
    }

    const friends = await db.friends.toArray();
    for (const entry of friends) {
      const newAvailableValue = entry.availableOnStart ? true : false;

      console.log(
        `Updating entry ${entry.fauxID}: availableOnStart=${entry.availableOnStart}, setting available to ${newAvailableValue}`,
      );

      await db.friends.update(entry.id, { available: newAvailableValue });

      const updatedEntry = await db.friends.get(entry.id);
      console.log(
        ` ${entry.fauxID}  is now: ${updatedEntry.available}`,
      );
    }
  };

  const handleImport = async (file) => {
    try {
      if (!file) throw new Error(`Only files can be dropped here`);
      console.log('Importing ' + file.name);

      // Close the current database
      await db.close();

      // Delete the current database
      await db.delete();

      // Import the file and get the new database instance
      const importedDb = await Dexie.import(file, {
        progressCallback: (progress) => {
          console.log(
            `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
          );
          setStatusMessage(
            `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
          );
        },
      });

      console.log('Import complete');

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

  return (
    <>
      {/* <HashImport /> */}
      {isAdmin && (
        <>
          <h3>game import export</h3>

          <div
            className="row"
            style={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button variant="primary" onClick={newGameWithWarning}>
              New Game
            </Button>
            <Button
              variant="toggleHelp"
              onClick={() => setToggleHelp(!toggleHelp)}
            >
              {toggleHelp ? 'x' : 'TroubleShooting'}
            </Button>
            {toggleHelp && (
              <div>
                <p>
                  If the database is still empty,ssssssssssss
                </p>
                <code>
                  C:\path\to\app\archive-6\resources\assets\databases\dexie-import.json"
                </code>
                <p>Sorry, this will be fixed in future releases!</p>
              </div>
            )}
          </div>
          <br />
          <div className="row align-items-start databasetable">
            <div className="col">
              <b>Current Database: </b>
              {db.name}
            </div>
            <div className="col">
              <b>Version:</b> {db.verno}
            </div>
          </div>
          <p>{status}</p>

          <div className="row align-items-start databasetable">
            {/* <div className="col">
          These currently do not work. They will be upgrades as they work.
          {isAdmin ? (
            <>
              {' '}
              <Button variant="primary" onClick={toggleAdmin}>
                Switch Start Database
              </Button>
              <Button variant="primary" onClick={notHookedUp}>
                Export Start Database From Full
              </Button>{' '}
              <Button variant="primary" onClick={notHookedUp}>
                Export Start New Game
              </Button>
            </>
          ) : (
            <>
              {' '}
              <Button variant="primary" onClick={toggleAdmin}>
                Switch Full Database
              </Button>
            </>
          )}
        </div> */}
          </div>

          <div className="row align-items-start databasetable">
            <div className="col">
              <Button variant="primary" className="mt-3" onClick={handleExport}>
                Export Database - JSON
              </Button>

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
              <Button variant="primary" onClick={clearDatabase}>
                Clear Database
              </Button>

              <Button variant="primary" onClick={saveAsDefaultDatabase}>
                Save as Default Database
              </Button>

              <div
                id="dropzone"
                className="dropzone"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                Drop dexie export JSON file here
              </div>
            </div>

            <div className="col">
              {/* <div>
            TODO:
            <ul>
              <li>☑ Get a database read/write/edit working</li>
              <li>☑ Update from Json on New Game</li>
              <li>☐ Update Full with new entries only</li>
              <li>☐ Create New, Full and Current databases</li>
              <li>☐ Switch between New, Full and Current databases</li>
              <li>☐ Set Current Database to 'New'</li>
            </ul>
          </div> */}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// export newGame;
export default ImportExport;
