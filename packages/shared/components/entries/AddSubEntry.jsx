import React from 'react';
import { useParams } from 'react-router-dom';
import { AddSubEntryForm } from '@components/entries/AddSubEntryFunc';
import { Link } from "react-router-dom";
import {GetTitle, GetSubentryCount} from '@hooks/dbHooks'

import { db } from "@utils/db"; // import the database
import { useLiveQuery } from "dexie-react-hooks";

const AddSubEntry = () => {
const { parentID, itemID } = useParams();

    const friends = useLiveQuery(() => db.friends.toArray());


// Find the parent in the array
const parentEntry = friends?.find(friend => friend.id === Number(parentID));
const parentTitle = parentEntry?.title || "Loading...";



  // Validate that we have at least a parentID
  if (!parentID) {
    return (
      <div className="alert alert-danger">
        <h4>Error: No Parent ID Provided</h4>
        <p>A parent entry ID  is required to add or edit sub-entries.</p>
      </div>
    );
  }

  return (
    <div className="container">
<h3>Edit Subentry</h3>
Go to Parent: {parentID} - <Link to={`/entry/${parentID}`}> {parentTitle}</Link> 
      <AddSubEntryForm
        parentID={parentID}
        itemID={itemID}
        isCollapsed={false}
      />
    </div>
  );
};

export default AddSubEntry;
