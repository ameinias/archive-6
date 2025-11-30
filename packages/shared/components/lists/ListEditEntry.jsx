import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { GameLogic } from "@utils/gamelogic";
import * as FormAssets from "@components/parts/FormAssets";
import { researcherIDs } from "@utils/constants";
import * as EditableFields from "@components/parts/EditableFields";

import {
  MediaCountCell,
  SubentryCountCell,
  AvailableCell,
} from "@components/parts/Badges";
import { eventManager } from "@utils/events";

export function EntryList() {
  // TODO: Clean these up. I think a lot of these aren't needed anymore.

  //#region     ---------------    CONST  ------------------ */

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();


  const { setStatusMessage, gameState, setColumn, setSort } = GameLogic();

  const [isLoading, setIsLoading] = useState(false);
  const [editingHex, setEditingHex] = useState(null);
  const [editingSubHex, setEditingSubHex] = useState(null);
  const [tempHexValue, setTempHexValue] = useState("");
  const [tempSubHexValue, setTempSubHexValue] = useState("");

  //#endregion

  //#region  ---------------    SORTING  ------------------ */

  const sortedFriends = useLiveQuery(() => {

    const column = gameState?.sortColumn || "title";
    const direction = gameState?.sortDirection || "asc";

    const query = db.friends.orderBy(column);
    return direction === "desc"
      ? query.reverse().toArray()
      : query.toArray();
  }, [gameState?.sortColumn, gameState?.sortDirection]);

  const handleSort = (column) => {

    if (column === gameState?.sortColumn) {
      // Toggle direction
      const newDirection =
        gameState.sortDirection === "asc" ? "desc" : "asc";
      setSort(newDirection);
    } else {
      // New column, reset to ascending
      setColumn(column);
      setSort("asc");
    }
  };

  //#endregion

  // //#region  ---------------    ???  ------------------ */
 

  const startEditingHex = (item, type) => {
    // Convert current hexHash to string for editing
    const currentValue = item.hexHash
      ? Array.isArray(item.hexHash)
        ? item.hexHash.join(", ")
        : item.hexHash.toString()
      : "";

    if (type === "entry") {
      setTempHexValue(currentValue);
      setEditingHex(item.id);
    } else {
      setTempSubHexValue(currentValue);
      setEditingSubHex(item.id);
    }
  };

  const saveHexHash = async (itemId, type) => {
    try {
      // Convert comma-separated string back to array

      if (type === "subentry") {
        const hexArray = tempSubHexValue
          .split(",")
          .map((hex) => parseInt(hex.trim(), 10))
          .filter((num) => !isNaN(num));

        await db.subentries.update(itemId, {
          hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null,
        });
        setEditingSubHex(null);
        setTempSubHexValue("");
      } else {
        const hexArray = tempHexValue
          .split(",")
          .map((hex) => parseInt(hex.trim(), 10))
          .filter((num) => !isNaN(num));

        await db.friends.update(itemId, {
          hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null,
        });
        setEditingHex(null);
        setTempHexValue("");
      }

      setStatusMessage(
        itemId + " Hex hash " + tempSubHexValue + "updated successfully",
      );
    } catch (error) {
      console.error("Error updating hex hash:", error);
      setStatusMessage("Error updating hex hash");
    }
  };

  const cancelEditingHex = () => {
    setEditingHex(null);
    setEditingSubHex(null);
    setTempHexValue("");
    setTempHexValue("");
  };


  useEffect(() => {
    const handleNewGameStart = () => setIsLoading(true);
    const handleNewGameEnd = () => {
      setIsLoading(false);
      // Force component refresh after new game
      window.location.reload(); // Simple but effective
    };

    window.addEventListener("newGameStart", handleNewGameStart);
    window.addEventListener("newGameEnd", handleNewGameEnd);

    return () => {
      window.removeEventListener("newGameStart", handleNewGameStart);
      window.removeEventListener("newGameEnd", handleNewGameEnd);
    };
  }, []);

//#endregion

  //#region --------------------  Remove Entries
  const removeItem = async (item) => {
    if (
      await eventManager.showConfirm(
        `Are you sure you want to delete "${item.title}"?`,
      )
    ) {
      db.friends.delete(item.id);
      setStatusMessage(`Entry ${item.title} successfully deleted.`);
    }
  };

  const removeSubentry = async (item) => {
    if (
      await eventManager.showConfirm(
        `Are you sure you want to delete "${item.title}"?`,
      )
    ) {
      db.subentries.delete(item.id);
      setStatusMessage(`Removing subentry: ${item.title}`);
    }
  };

//#endregion
  if (isLoading || !friends || !subentries) {
    return (
      <div className="List">
        <h3>Please wait while database populates...</h3>
      </div>
    );
  }

  return (
    <>
      {!sortedFriends || sortedFriends.length === 0 ? (
        <div className="List">
          <table className="entryTable">
            <tbody>
              <tr>
                <td colSpan={3}>
                  No Entries!
                  <br />
                  Hit <Link to="/import-export">Admin</Link> / New Game to get
                  the starter database while work in progress.
                  <div className="div">
                    <Link to="/edit-item/new">
                      <Button className="btn-add-item">New Entry</Button>
                    </Link>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="List">
            <h3>Entries:</h3>
            <Link to="/entry/new">
              <Button className="btn-add-item">New Entry</Button>
            </Link>
            <table className="searchResults">
              <thead>
                <tr>
                  <th onClick={() => handleSort("title")}>
                    Title{" "}
                    {gameState?.sortColumn === "title" &&
                      (gameState?.sortDirection === "asc" ? "▲" : "▼")}
                  </th>

                  <th width="75px" onClick={() => handleSort("displayDate")}>
                    Display Date{" "}
                    {gameState?.sortColumn === "displayDate" &&
                      (gameState?.sortDirection === "asc" ? "▲" : "▼")}
                  </th>

                  <th width="75px" onClick={() => handleSort("date")}>
                    Added Date{" "}
                    {gameState?.sortColumn === "date" &&
                      (gameState?.sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th width="25px">Hex</th>
                  <th width="25px" title="sub entries">Subs</th>
                  <th width="25px" title="media attachments">🖼️</th>
                  <th width="25px" title="active">🔛</th>
                  <th width="30px">🗑️</th>
                </tr>
              </thead>
              <tbody>
                {sortedFriends.map((item) => (
                  <tr key={item.id}>
                    <td data-label="name">
                      {item.id}{" "}
                      <Link to={`/entry/${item.id}`}>
                        {item.fauxID} : {item.title}
                      </Link>
                    </td>
                    <td width="50px" data-label="displayDate">
                      {item.displayDate
                        ? new Date(item.displayDate).toLocaleDateString(
                            "en-US",
                            { month: "numeric", year: "numeric" },
                          )
                        : "No Date"}
                    </td>
                    <td width="50px" data-label="date">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-US")
                        : "No Date"}
                    </td>
                    <td data-label="hex">
                      {editingHex === item.id ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                            width: "40px",
                          }}
                        >
                          <input
                            type="text"
                            name="hexedit"
                            title="hexedit"
                            value={tempHexValue}
                            onChange={(e) => setTempHexValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                saveHexHash(item.id, "entry");
                              if (e.key === "Escape") cancelEditingHex();
                            }}
                            placeholder="hexes"
                            style={{
                              flex: 1,
                              padding: "2px 5px",
                              width: "40px",
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <div
                          onClick={() => startEditingHex(item, "entry")}
                          style={{
                            cursor: "pointer",
                            padding: "5px",
                            borderRadius: "3px",
                            ":hover": { backgroundColor: "#f0f0f0" },
                          }}
                          title="Click to edit"
                        >
                          {item.hexHash
                            ? Array.isArray(item.hexHash)
                              ? item.hexHash.join(", ")
                              : item.hexHash.toString()
                            : "None (click to add)"}
                        </div>
                      )}
                    </td>
                    <td data-label="subentries">
                      <SubentryCountCell parentId={item.id} />
                    </td>
                    <td data-label="media">
                      <MediaCountCell itemId={item.id} type="entry" />
                    </td>
                    <td data-label="currentlyavailable">
                      <AvailableCell itemId={item.id} type="entry" />
                    </td>

                    <td data-label="remove">
                      {" "}
                      <button
                        className="remove-button-small"
                        aria-label="Close"
                        onClick={() => removeItem(item)}
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="List">
            <h3>Subentries:</h3>
            <table className="searchResults">
              <thead>
                <tr>
                  <th onClick={() => handleSort("title")}>
                    Title{" "}
                    {gameState?.sortColumn === "title" &&
                      (gameState?.sortDirection === "asc" ? "▲" : "▼")}
                  </th>

                  <th width="75px" onClick={() => handleSort("displayDate")}>
                    Display Date{" "}
                    {gameState?.sortColumn === "displayDate" &&
                      (gameState?.sortDirection === "asc" ? "▲" : "▼")}
                  </th>

                  <th width="75px" onClick={() => handleSort("date")}>
                    Added Date{" "}
                    {gameState?.sortColumn === "date" &&
                      (gameState?.sortDirection === "asc" ? "▲" : "▼")}
                  </th>
                  <th width="110px">Researcher</th>
                  <th width="25px"> Hex</th>
                  <th width="25px">🖼️</th>
                  <th width="25px">🔛</th>
                  <th width="30px">🗑️</th>
                </tr>
              </thead>

              <tbody>
                {subentries?.map((item) => (
                  <tr key={item.id}>
                    <td width="70%" data-label="title">
                      <Link to={`/entry/${item.parentId}/${item.id}`}>
                        {item.fauxID} : {item.title}
                      </Link>
                    </td>
                    <td>
                      {item.displayDate
                        ? typeof item.displayDate === "string"
                          ? item.displayDate
                          : new Date(item.displayDate).toLocaleDateString()
                        : "No date"}
                      {/*  Below isn't working yet. Taking a break. TODO */}
                      {/* <EditableFields.EditDate itemID={item.id} type="subentry" /> */}
                    </td>
                    <td width="50px" data-label="date">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-US")
                        : "No Date"}
                    </td>
                    <td>
                      <EditableFields.EditResearcher
                        itemID={item.id}
                        type="subentry"
                      />
                    </td>
                    <td data-label="hexChild">
                      {editingSubHex === item.id ? (
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            alignItems: "center",
                            width: "40px",
                          }}
                        >
                          <input
                            type="text"
                            name="hexeditChild"
                            title="hexeditChild"
                            value={tempSubHexValue}
                            onChange={(e) => setTempSubHexValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter")
                                saveHexHash(item.id, "subentry");
                              if (e.key === "Escape") cancelEditingHex();
                            }}
                            placeholder="Enter hex values (comma separated)"
                            style={{
                              flex: 1,
                              padding: "2px 5px",
                              width: "40px",
                            }}
                            autoFocus
                          />

                        </div>
                      ) : (
                        <div
                          onClick={() => startEditingHex(item, "subentry")}
                          style={{
                            cursor: "pointer",
                            padding: "5px",
                            borderRadius: "3px",
                            ":hover": { backgroundColor: "#f0f0f0" },
                          }}
                          title="Click to edit"
                        >
                          {item.hexHash
                            ? Array.isArray(item.hexHash)
                              ? item.hexHash.join(", ")
                              : item.hexHash.toString()
                            : "None"}
                        </div>
                      )}
                    </td>
                    <td data-label="media">
                      <MediaCountCell itemId={item.id} type="subentry" />
                    </td>
                    <td data-label="available">
                      <AvailableCell itemId={item.id} type="subentry" />
                    </td>

                    <td data-label="remove">
                      {" "}
                      <button
                        className="remove-button-small"
                        onClick={() => removeSubentry(item)}
                      >
                        x
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
