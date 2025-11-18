import { Button, Tab, Tabs } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import Dexie from "dexie";
import {
  db,
  dbHelpers,
  newGameWithWarning,
  saveAsDefaultDatabase,
} from "@utils/db"; // import the database
import "dexie-export-import"; // Import the export/import addon
import { GameLogic } from "@utils/gamelogic";
// import { clear } from 'console';
import HashImport from "./HashImport";
import { useLiveQuery } from "dexie-react-hooks";
import { subCategories } from "@utils/constants";
import { eventManager } from "@utils/events";
import { setStartAvalability } from "@hooks/dbHooks.js";
import { DataState } from "../parts/Badges";


function ImportExport() {
  const { isAdmin, toggleAdmin, setStatusMessage } = GameLogic();
  const [toggleHelp, setToggleHelp] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const notHookedUp = () => {
    // Placeholder so links can be made
    console.log("This feature is not hooked up yet. Please check back later.");
  };

  const NewGame = async (startHash) => {
    await newGameWithWarning(startHash);
    setRefreshKey(prev => prev + 1);
    console.log("start game with hex:", startHash);
  };

  const ImportDI = async () => {
    try {
      setStatusMessage("Loading bundled database...");

      // Read the bundled file
      const fileContents =
        await eventManager.readBundledFile("dexie-import.json");

      // Confirm before replacing
      if (
        !(await eventManager.showConfirm(
          "This will replace your current database with the default bundled version. Continue?",
        ))
      ) {
        setStatusMessage("Import cancelled");
        return;
      }

      // Convert string to Blob (same as File object)
      const blob = new Blob([fileContents], { type: "application/json" });

      console.log("Read bundled database file, length:", blob.length);

      // Close current database
      await db.close();

      // Delete current database
      await db.delete();

      const importedDb = await Dexie.import(blob, {
        progressCallback: (progress) => {
          console.log(
            `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
          );
          setStatusMessage(
            `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
          );
        },
      });

      console.log(" Bundled database loaded successfully");
      setStatusMessage("Database reset to default version successfully!");

      // Reopen database
      await db.open();

      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error(" Error loading bundled database:", error);
      setStatusMessage(`Error: ${error.message}`);

      // Try to reopen database
      try {
        await db.open();
      } catch (reopenError) {
        console.error("Failed to reopen database:", reopenError);
      }
    }
  };

  const UpdateDBVersion = async () => {
    // get db.gamedata.version = highest entry
    let dbVersion = await db.gamedata.orderBy("expVersion").last().expVersion;

    const resourceVersion = await CheckVersionFile();

    // If database hasn't saved a version, save it now
    if (!dbVersion) {
      await db.gamedata.put({
        expVersion: resourceVersion,
        uploadedAt: new Date(),
      });
      dbVersion = resourceVersion;
    } else {

    }

          console.log(
        "Last DB version entry is:",
        dbVersion,
        "resource DB version is",
        resourceVersion,
      );
  };

  const testio = async () => {
    UpdateDBCount();
  };

  const UpdateVersionTxt = async () => {
    const status = await eventManager.updateVersionFile();
    console.log("Version updated:", status);
  };

  const CheckVersionFile = async () => {
    const status = await eventManager.checkVersionFile(3);
    console.log("Version is:", status);

    return status;
  };

  // this function fakes a bunch of clicking and interaction. could be useful later for database ghosts.
  const handleExport = async () => {
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
      a.download = "dexie-export.json";
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

  const handleExportBlob = async () => {
    try {
      // Ensure the export function is available
      if (typeof db.export !== "function") {
        throw new Error("dexie-export-import addon not properly loaded");
      }
      const blob = await db.export({ prettyJson: true });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "dexie-export.json";
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

  const clearDatabase = async () => {
    setStatusMessage("Attempting to reset the database...");

    if (
      !(await eventManager.showConfirm(`This will delete all current database entries. You may want to make a backup first. Proceed anyway?
      `))
    ) {
      console.log("no");
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
      console.log(` ${entry.fauxID}  is now: ${updatedEntry.available}`);
    }
  };

  const handleCSVExport = async () => {
    try {
      const friends = await db.friends.toArray();
      const subentries = await db.subentries.toArray();

      // Process data and convert hexHash IDs to names
      const processedFriends = friends.map((item) => ({
        ...item,
        hexHashCodes: item.hexHash
          ? dbHelpers.getHexHashCodesFromIds(item.hexHash).join(", ")
          : "",
        type: "main_entry",
      }));

      const processedSubentries = subentries.map((item) => ({
        ...item,
        hexHashCodes: item.hexHash
          ? dbHelpers.getHexHashCodesFromIds(item.hexHash).join(", ")
          : "",
        type: "sub_entry",
      }));

      const combinedData = [...processedFriends, ...processedSubentries];

      const selectedFields = [
        "fauxID",
        "category",
        "hexHashCodes",
        "subCategory",
      ];

      // Map field names to display names for CSV headers
      const fieldDisplayNames = {
        fauxID: "ID",
        category: "RecordType",
        subCategory: "aRecordType",
        hexHashCodes: "hexHashCodes",
      };

      // Create CSV content with custom headers
      let csvContent =
        selectedFields.map((field) => fieldDisplayNames[field]).join(",") +
        "\n";

      combinedData.forEach((row) => {
        const values = selectedFields.map((field) => {
          let value = row[field];

          // Handle arrays/objects by converting to string
          if (Array.isArray(value)) {
            value = value.join("; "); // Join array elements with semicolon
          } else if (typeof value === "object" && value !== null) {
            value = JSON.stringify(value);
          }

          // Escape commas and quotes for CSV
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }

          return value || "";
        });
        csvContent += values.join(",") + "\n";
      });

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "database-export-backup-1996FINAL.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatusMessage("CSV export with hex hash names complete");
    } catch (error) {
      console.error("CSV Export error:", error);
      setStatusMessage("CSV export failed: " + error.message);
    }
  };

  const handleImportAppend = async (file) => {
    try {
      if (!file) throw new Error(`Only files can be dropped here`);
      console.log("Importing " + file.name);

      // Close the current database
      await db.close();

      // Import the file and get the new database instance
      const importedDb = await Dexie.import(file, {
        overwriteValues: true,
        progressCallback: (progress) => {
          console.log(
            `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
          );
          setStatusMessage(
            `Import progress: ${progress.completedRows}/${progress.totalRows} rows`,
          );
        },
      });

      console.log("Import complete");

      // Reopen the original database to refresh it
      await db.open();
    } catch (error) {
      console.error("Import error:", error);
      // Try to reopen the database even if import failed
      try {
        await db.open();
      } catch (reopenError) {
        console.error("Failed to reopen database:", reopenError);
      }
    }
  };

  const handleImportReplace = async (file) => {
    try {
      if (!file) throw new Error(`Only files can be dropped here`);
      console.log("Importing " + file.name);

      console.log("Read imported database file, length:", file.length);

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

      console.log("Import complete");

      // Reopen the original database to refresh it
      await db.open();

      // window.location.reload();
    } catch (error) {
      console.error("Import error:", error);
      // Try to reopen the database even if import failed
      try {
        await db.open();
      } catch (reopenError) {
        console.error("Failed to reopen database:", reopenError);
      }
    }
  };

  const handleDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImportReplace(file);
    }
  };

  const handleFileAppendChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImportAppend(file);
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

          <section className="center">
            <button className="db-btn" onClick={() => NewGame(1)}>
              New Game Vingette 1
            </button>
                        <button className="db-btn" onClick={() => NewGame(10)}>
              New Game Vingette 2
            </button>
          </section>

          <section className="tabs">
            <menu role="tablist" aria-label="Tabs Template">
              <button role="tab" aria-controls="tab-A" aria-selected="true">
                Database Info
              </button>
              <button role="tab" aria-controls="tab-D">
                Troubleshooting
              </button>
            </menu>
            <article role="tabpanel" id="tab-A">
              <div className="row align-items-start databasetable">
                <div className="col">
                  <b>Current Database: </b>
                  {db.name}
                </div>
                <div className="col">
                  <b>Version:</b> {db.verno}
                </div>
                <div className="col"><DataState key={refreshKey} refreshTrigger={refreshKey} /></div>
              </div>
            </article>
            <article role="tabpanel" id="tab-D" hidden>
              <div>
                <p>If the database is still empty,ssssssssssss</p>
                <code>
                  C:\path\to\app\archive-6\resources\assets\databases\dexie-import.json"
                </code>
                <p>Sorry, this will be fixed in future releases!</p>
              </div>
            </article>
          </section>

          <section>
            <p>{status}</p>
          </section>
          <section>
            <div className="row align-items-start databasetable"></div>

            <div className="row align-items-start databasetable">
              <div className="col">
                <button className="db-btn" onClick={saveAsDefaultDatabase}>
                  Save as Default Database
                </button>

                <button className="db-btn" onClick={handleExport}>
                  Export Database - JSON
                </button>

                <button className="db-btn" onClick={handleCSVExport}>
                  Export Database - CSV
                </button>

                <button className="db-btn" onClick={ImportDI}>
                  Import DB from DI
                </button>
              </div>
              <div className="col">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileInputChange}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <button
                  className="db-btn"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Import Database
                </button>

                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileAppendChange}
                  style={{ display: "none" }}
                  id="fileAppend"
                />
                <button
                  className="db-btn"
                  onClick={() => document.getElementById("fileAppend").click()}
                >
                  Append Database
                </button>

                <button className="db-btn" onClick={clearDatabase}>
                  Clear Database
                </button>

                <button
                  onClick={async () => {
                    if (
                      eventManager.showConfirm(
                        "Clear all data? This cannot be undone!",
                      )
                    ) {
                      await window.electronAPI.clearAllData();
                      window.location.reload();
                    }
                  }}
                >
                  Clear All App Data
                </button>

                <button className="db-btn" onClick={testio}>
                  Test Something
                </button>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}

// export newGame;
export default ImportExport;
