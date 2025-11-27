import React, { useState, useEffect } from "react";
import { db, dbHelpers } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { AddSubEntryForm } from "@components/entries/AddSubEntryFunc";
import { researcherIDs } from "@utils/constants.js";

export function ListSubEntries({ itemID }) {
  // HOOKS
     const [toggleShowCurrentSubEntry, setToggleShowCurrentSubEntry] = useState(false);
  const [toggleShowNewSubEntry, setToggleShowNewSubEntry] = useState(false);
  const navigate = useNavigate();

  // Use useLiveQuery to automatically update when database changes
  const subEntryOfParentLQ =
    useLiveQuery(async () => {
      if (!itemID) return [];

      const parentId = Number(itemID);
      if (isNaN(parentId) || parentId <= 0) return [];

      try {
        return await db.subentries.where("parentId").equals(parentId).toArray();
      } catch (error) {
        console.error("Error fetching subentries:", error);
        return [];
      }
    }, [itemID]) || [];

  const removeItem = async (item) => {
    try {
      await db.subentries.delete(item.id);
      console.log("Removing item: ", item.title);
      // No need to manually update state - useLiveQuery handles it
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="subentry-add-list">
      {subEntryOfParentLQ.length != 0 && (
        <div title="list existing entries">
          {subEntryOfParentLQ.map((item) => (
            // <div className="single-subentry-listing" key={item.id}>
            //   <button title="remove"
            //     className="remove-button-small right"
            //     onClick={() => removeItem(item)}
            //   >
            //     x
            //   </button>{" "}
              
            //   <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
            //     {item.fauxID} : {item.title}
            //   </Link>{" "}

            //   <span className="subentry-meta right">
            //     {item.displayDate
            //       ? typeof item.displayDate === "string"
            //         ? item.displayDate
            //         : new Date(item.displayDate).toLocaleDateString()
            //       : "No date"}
            //    {"   "} | {"   "}
            //     {item.researcherID !== null && item.researcherID !== undefined
            //       ? researcherIDs.find(
            //           (researcher) =>
            //             researcher.id === parseInt(item.researcherID),
            //         )?.name || "Unknown"
            //       : "Unknown User"}
            //   </span>
            // </div>

<div title="new-entry-form">         <div title="Toggle Add Subentry">
      <div title="Toggle Button" className="button-row">
        <button title="add or remove"
          variant={toggleShowCurrentSubEntry ? "remove-item" : "btn-add-item"}
          className={toggleShowCurrentSubEntry ? "remove-item" : "btn-add-item"}
          onClick={() => setToggleShowCurrentSubEntry(!toggleShowCurrentSubEntry)}
        >
          {toggleShowCurrentSubEntry ? "xxxx" : ""}

          {item.fauxID} : {item.title}
        </button>
      </div>

      <div title="embeded add subentry form">
        {toggleShowCurrentSubEntry && (
          <>
     
          <AddSubEntryForm
            parentID={item.parentId}
            itemID={item.id}
            onCancel={() => setToggleShowCurrentSubEntry(false)}
          />

          </>
        )}
      </div>
      </div>         </div>
          ))}
        </div>
      )}

      <div title="Toggle Add Subentry">
      <div title="Toggle Button" className="button-row">
        <button
          variant={toggleShowNewSubEntry ? "remove-item" : "btn-add-item"}
          className={toggleShowNewSubEntry ? "remove-item" : "btn-add-item"}
          onClick={() => setToggleShowNewSubEntry(!toggleShowNewSubEntry)}
        >
          {toggleShowNewSubEntry ? "x" : "Add SubEntry"}
        </button>
      </div>

      <div title="embeded add subentry form">
        {toggleShowNewSubEntry && (
          <AddSubEntryForm
            parentID={itemID?.toString()}
            itemID="new"
            onCancel={() => setToggleShowNewSubEntry(false)}
          />
        )}
      </div>
      </div>

    </div>
  );
}
