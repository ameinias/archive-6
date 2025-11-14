import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db, dbHelpers } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import * as EntryParts from '@components/entries/EntryParts.jsx';



export function EntryFunc({itemID, parentID, isSubEntry}) {
  const { id } = itemID; // get the id from the route

    const item = useLiveQuery(() => {
      const numericID = Number(itemID);
      if (!itemID || isNaN(numericID) || numericID <= 0) {
        console.warn('Invalid itemID for database query:', itemID);
        return null;
      }
      return db.friends.get(numericID);
    }, [itemID]);


     if (item === undefined) {
    return <div>Loading...</div>;
  }

  if (item === null) {
    return (
      <div>
        <h2>Item not found</h2>
        <p>The requested item {itemID} could not be found in the database.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to List
        </Button>
      </div>
    );
  }

return (
    <div className={`List `}>
      {/* {friend.map((item) => ( */}
      <div key={item.id}>


        <EntryParts.EntryHeader item={item} type='Entry' />
      </div>
    </div>
  );
}