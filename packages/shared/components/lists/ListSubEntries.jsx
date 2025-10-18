import React, { useState, useEffect } from 'react';
import { db, dbHelpers } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AddSubEntryForm } from '@components/entries/AddSubEntryFunc';
import { researcherIDs } from '@utils/constants.js';

export function ListSubEntries({ itemID }) {
  const [toggleShowNewSubEntry, setToggleShowNewSubEntry] = useState(false);
  const navigate = useNavigate();



  // Use useLiveQuery to automatically update when database changes
  const subEntryOfParentLQ = useLiveQuery(async () => {
    if (!itemID) return [];

    const parentId = Number(itemID);
    if (isNaN(parentId) || parentId <= 0) return [];

    try {
      return await db.subentries.where('parentId').equals(parentId).toArray();
    } catch (error) {
      console.error('Error fetching subentries:', error);
      return [];
    }
  }, [itemID]) || [];

  const removeItem = async (item) => {
    try {
      await db.subentries.delete(item.id);
      console.log('Removing item: ', item.title);
      // No need to manually update state - useLiveQuery handles it
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="subentry-add-list">
      {subEntryOfParentLQ.length === 0 ? (
        <>
          <Button
            variant={toggleShowNewSubEntry ? 'remove-item' : 'add-item'}
            onClick={() => setToggleShowNewSubEntry(!toggleShowNewSubEntry)}
          >
            {toggleShowNewSubEntry ? 'x' : 'Add Subentry'}
          </Button>
        </>
      ) : (
        <>
         <div>
              {subEntryOfParentLQ.map((item) => (
                <div key={item.id}>

                  <div >
                    <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                      {item.fauxID} : {item.title}
                    </Link>  <span className="subentry-meta"> 
    {item.displayDate ? (
      typeof item.displayDate === 'string' 
        ? item.displayDate 
        : new Date(item.displayDate).toLocaleDateString()
    ) : 'No date'}

   - {item.researcherID !== null && item.researcherID !== undefined
    ? researcherIDs.find(researcher => researcher.id === parseInt(item.researcherID))?.name || 'Unknown'
    : 'Unknown User'
  }
</span>

                  </div>
                  <div>
                    <Button
                      variant="remove-button"
                      onClick={() => removeItem(item)}
                    ></Button>
                  </div>
                  </div>
              ))}
            </div>

                {/* what is going on here. */}
          <Button
            variant={toggleShowNewSubEntry ? 'remove-item' : 'add-item'}
            onClick={() => setToggleShowNewSubEntry(!toggleShowNewSubEntry)}
          >
            {toggleShowNewSubEntry ? 'x' : 'Add SubEntry'}
          </Button>
        </>
      )}

      {toggleShowNewSubEntry && (
        <AddSubEntryForm
          parentID={itemID?.toString()}
          itemID="new"
          onCancel={() => setToggleShowNewSubEntry(false)}
        />
      )}
    </div>
  );
}
