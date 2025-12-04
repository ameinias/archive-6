import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from "react";
import { db, dbHelpers } from "@utils/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { GameLogic } from "@utils/gamelogic";
import { Link } from "react-router-dom";
import { StaticSubListItem } from "@components/parts/StaticSubListItem";
import { BookMarkCheck } from "@components/parts/Badges";
import { MediaDisplay } from "@components/parts/Media/MediaDisplay";
import { MediaThumbnail } from "@components/parts/Media/MediaThumbnail.jsx";
import DescriptionEntry from "@components/parts/DescriptionEntry";
import { MediaEntryDisplay } from "@components/parts/Media/MediaEntryDisplay";

export function StaticSingleDefault({ itemID }) {
  const { id } = useParams(); // get the id from the route
  const gameLogic = GameLogic();

  const item = useLiveQuery(() => {
    const numericID = Number(itemID);
    console.log("edit access: " + gameLogic.gameState.editAccess);
    if (!itemID || isNaN(numericID) || numericID <= 0) {
      console.warn("Invalid itemID for database query:", itemID);
      return null;
    }
    return db.friends.get(numericID);
  }, [itemID]);

  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState("");

  const allFriends = useLiveQuery(() => db.friends.toArray(), []);

  const getEntryTitle = (entryId) => {
    if (!allFriends) return entryId;
    const entry = allFriends.find((f) => f.id === Number(entryId));
    return entry?.fauxID || entryId;
  };

  const subEntryOfParent =
    useLiveQuery(() => {
      const numericID = Number(itemID);
      if (!itemID || isNaN(numericID) || numericID <= 0) {
        return [];
      }
      return db.subentries.where("parentId").equals(numericID).toArray();
    }, [itemID]) || [];


  if (item === undefined) {
    return <div>Loading...</div>;
  }

  if (item === null) {
    return (
      <div>
        <h2>Item not found</h2>
        <p>The requested item {itemID} could not be found in the database.</p>
        <Button variant="primary" onClick={() => navigate("/")}>
          Back to List
        </Button>
      </div>
    );
  }

  if (item.available === false) {
    return (
      <div className="subentry-staticentry subEntry-not-available">
        <span className="subIDSpan">
          <h3>{item.fauxID} </h3>{" "}
        </span>
        <span>*****NOT AVAILABLE : DATA CORRUPTED*******</span>{" "}
      </div>
    );
  }

  return (
    <div className={`List ${gameLogic.gameState.level > 0 ? "haunted" : ""}`}>
      {/* {friend.map((item) => ( */}
      <div key={item.id}>


        <div className="entry-header">
          {" "}
          <div style={{}}>
            <BookMarkCheck itemID={item.id} type="entry" />
          </div>
          <div className="entry-title">
            <span className="parentIDSpan">{item.fauxID}</span>
            <span className="parentTitleSpan">{item.title}</span>
          </div>
        </div>


        <div title="Metadata">
          <div>
            <b>Category:</b> {item.category}{" "}
          </div>
          <div>
            <b>Collected:</b>{" "}
            {item.displayDate
              ? new Date(item.displayDate).toLocaleDateString("en-US", {
                  month: "numeric",
                  year: "numeric",
                })
              : "No Date"}
          </div>


          {subEntryOfParent
            .filter((item) => item.subCategory.toLowerCase() === "metadata")
            .map((item) => (
              <div key={item.id}>

                <StaticSubListItem
                    itemID={item.id}
                    parentID={item.parentId}
                    meta={true}
                  />





              </div>
            ))}

                      <div>
            <DescriptionEntry string={item.description} />
          </div>
        </div>

        <div className="subentry-add-list flex">
<MediaEntryDisplay itemID={item.id} type="entry" />
        </div>

        {/* Show subentries if they exist */}
        {subEntryOfParent.filter(
          (item) => item.subCategory.toLowerCase() !== "metadata",
        ).length != 0 && (
          <div title="Subentries">
            <h2>Logs</h2>
            {subEntryOfParent
              .filter((item) => item.subCategory.toLowerCase() !== "metadata")
              .map((item) => (
                <div key={item.id}>
                  <StaticSubListItem
                    itemID={item.id}
                    parentID={item.parentId}
                  />
                </div>
              ))}
          </div>
        )}
        {gameLogic.gameState.editAccess && (<>add record</> )}
      </div>
    </div>
  );
}
