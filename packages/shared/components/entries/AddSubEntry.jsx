import React from 'react';
import { useParams } from 'react-router-dom';
import { AddSubEntryForm } from '../admin/AddSubEntryFunc';

const AddSubEntry = () => {
const { parentID, itemID } = useParams();

  console.log('URL params - parentID:', parentID, 'itemID:', itemID);

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

      <AddSubEntryForm
        parentID={parentID}
        itemID={itemID}
      />
    </div>
  );
};

export default AddSubEntry;
