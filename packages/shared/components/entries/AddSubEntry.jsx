import React from 'react';
import { useParams } from 'react-router-dom';
import { AddSubEntryForm } from '@components/entries/AddSubEntryFunc';
import { Link } from "react-router-dom";
import {GetTitle, GetSubentryCount} from '@hooks/dbHooks'

const AddSubEntry = () => {
const { parentID, itemID } = useParams();



  // Validate that we have at least a parentID
  if (!parentID) {
    return (
      <div className="alert alert-danger">
        <h4>Error: No Parent ID Provided</h4>
        <p>A parent entry ID is required to add or edit sub-entries.</p>
      </div>
    );
  }

  return (
    <div className="container">
<h3>Edit Subentry</h3>
<Link to={`/entry/${parentID}`}>Go to Parent: {parentID} </Link> 
      <AddSubEntryForm
        parentID={parentID}
        itemID={itemID}
        isCollapsed={false}
      />
    </div>
  );
};

export default AddSubEntry;
