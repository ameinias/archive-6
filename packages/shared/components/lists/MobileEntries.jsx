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
import { FilterList, applyHexFilter } from "@components/parts/ListingComponent";

import {
  MediaCountCell,
  SubentryCountCell,
  AvailableCell,
} from "@components/parts/Badges";
import { eventManager } from "@utils/events";
import { safeRender, safeDate } from "@utils/helper";

export function MobileEntryList() {
  const [isLoading, setIsLoading] = useState(false);
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();
  const gameLogic = GameLogic();
  const { setStatusMessage, gameState, setColumn, setSort, updateGameState } =
    GameLogic();

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

  // --------------------  Remove Entries
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

  // Sort friends by date
  const sortedFriends = friends
    ? [...friends].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  const filteredFriends = useLiveQuery(() => {
    const column = gameState?.sortColumn || "title";
    const direction = gameState?.sortDirection || "asc";

    return db.friends.toArray().then((items) => {
      // Apply hex filter first - only the items that match the filter are shown
      let filtered = applyHexFilter(items, gameState?.activeFilter);

      // console.log("type: entry, column:", column, "direction:", direction);

      // Sort the filtered items
      filtered.sort((a, b) => {
        let aValue = a[column];
        let bValue = b[column];

        // Handle date columns specially
        // if (column === 'date' || column === 'displayDate') {
        //   aValue = aValue ? new Date(aValue).getTime() : 0
        //   bValue = bValue ? new Date(bValue).getTime() : 0
        // } else
        if (column === "hexHash") {
          // Get lowest hex from item 'a'
          const hexesA = Array.isArray(a.hexHash) ? a.hexHash : [a.hexHash];
          const lowestA =
            hexesA.length > 0
              ? Math.min(...hexesA.filter((h) => h != null))
              : Infinity;

          // Get lowest hex from item 'b'
          const hexesB = Array.isArray(b.hexHash) ? b.hexHash : [b.hexHash];
          const lowestB =
            hexesB.length > 0
              ? Math.min(...hexesB.filter((h) => h != null))
              : Infinity;

          // Return comparison result
          return direction === "asc" ? lowestA - lowestB : lowestB - lowestA;
        } else 
          
          if (typeof aValue === "string" && typeof bValue === "string") {
          // For string columns, use localeCompare
          return direction === "asc"
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        // Numeric comparison for dates and numbers
        if (direction === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });

      return filtered;
    });
  }, [
    gameState?.sortColumn,
    gameState?.sortDirection,
    gameState?.activeFilter,
  ]);

  if (isLoading || !friends || !subentries) {
    return (
      <div className="List">
        <h3>Please wait while database populates...</h3>
      </div>
    );
  }

  const handleFilterChange = (filter) => {
    updateGameState("activeFilter", filter);
  };

  return (
    <>
      <div className="center">
        <FilterList
          type="entry"
          onFilterChange={handleFilterChange}
          activeFilter={gameState?.activeFilter}
        />
      </div>
      {filteredFriends.length === 0 ? (
        <div className="List">
          <table className="entryTable">
            <tbody>
              <tr>
                <td colSpan={3}>
                  No Entries!
                  <br />
                  Hit <Link to="/import-export">Admin</Link> / New Game to get
                  the starter database while work in progress.
                  <Link to="/edit-item/new">
                    <Button className="btn-add-item">New Entry</Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <div className="List table-container">
            <h3>Entries:</h3>
            <Link to="/edit-item/new">
              <Button className="btn-add-item">New Entry</Button>
            </Link>
            
            <table className="searchResults responsive-table">
              <thead>
                <tr>
                  <th>Name</th>
                                    <th width="80px" 
                  // onClick={() => handleSort("displayDate")}
                  >
                    Disp. Date{" "}
                  </th>
                  <th>🗑️</th>
                </tr>
              </thead>
              <tbody>
                {filteredFriends.map((item) => (
                  <tr key={item.id}>
                    <td data-label="name">
                      {item.id}{" "}
                      <Link to={`/entry/${item.id}`}>
                        {item.fauxID} : {item.title}
                      </Link>
                    </td>
            <td
                      width="50px"
                      data-label="displayDate"
                      title="will fix editing later TODO"
                    >

                      {safeDate(item.displayDate)}


                    </td>
                    <td width="25px" data-label="remove">
                      {" "}
                      <Button
                        className="remove-button-small"
                        onClick={() => removeItem(item)}
                      >
                        {" "}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="List">
            <h3>Subentries:</h3>
            <table className="searchResults responsive-table">
              <thead>
                <tr>
                  <th>Name</th>

                  <th width="80px" 
                  // onClick={() => handleSort("displayDate")}
                  >
                    Disp. Date{" "}
                  </th>
                  <th>🗑️</th>
                </tr>
              </thead>

              <tbody>
                {subentries?.map((item) => (
                  <tr key={item.id}>
                    <td data-label="title">
                      <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                        {item.fauxID} : {item.title}
                      </Link>
                    </td>
                     <td
                      width="50px"
                      data-label="displayDate"
                      title="will fix editing later TODO"
                    >

                      {safeDate(item.displayDate)}


                    </td>

                    <td width="20px" data-label="remove">
                      {" "}
                      <Button
                        className="remove-button button-small remove-button-small"
                        onClick={() => removeSubentry(item)}
                      ></Button>
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
