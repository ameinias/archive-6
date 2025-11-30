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
  const [toggleShowCurrentSubEntry, setToggleShowCurrentSubEntry] =
    useState(false);
  const [toggleShowNewSubEntry, setToggleShowNewSubEntry] = useState(false);
  const navigate = useNavigate();

  // Use useLiveQuery to automatically update when database changes
  const subEntryOfParentLQ =
    useLiveQuery(async () => {
      if (!itemID) return [];

      const parentId = Number(itemID);
      if (isNaN(parentId) || parentId <= 0) return [];

      try {
        const subArray = await db.subentries
          .where("parentId")
          .equals(parentId)
          .toArray();

        const sortedSubs = subArray.sort((a, b) => {
          const dateA = a.displayDate || "0000-00-00";
          const dateB = b.displayDate || "0000-00-00";

          return dateA.localeCompare(dateB);
        });

        return sortedSubs;
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
            <div title="existing entrie" className="row">
              <AddSubEntryForm
                parentID={item.parentId}
                itemID={item.id}
                onCancel={() => setCollapsed(true)}
              />
            </div>
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
              isCollapsed={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
