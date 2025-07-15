import React, { useState, useEffect } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AddSubEntryForm } from './AddSubEntryFunc';

export function ListSubEntries({ itemID }: { itemID?: number }) {
  const [toggleShowNewSubEntry, setToggleShowNewSubEntry] = useState(false);
  const navigate = useNavigate();

  // Use useLiveQuery to automatically update when database changes
  const subEntryOfParent = useLiveQuery(async () => {
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

  const removeItem = async (item: any) => {
    try {
      await db.subentries.delete(item.id);
      console.log('Removing item: ', item.title);
      // No need to manually update state - useLiveQuery handles it
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <div className="List">
      <h3>Sub Entries</h3>
      {subEntryOfParent.length === 0 ? (
        <p>No sub-entries found for parent {itemID}.</p>
      ) : (
        <table>
          <tbody>
            {subEntryOfParent.map((item) => (
              <tr key={item.id}>
                <td width="80%">
                  {item.id} <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                    {item.fauxID} : {item.title}
                  </Link> ParentID: {item.parentId}
                </td>
                <td>
                  <Button variant="outline-danger" onClick={() => removeItem(item)}>
                    Remove
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Button
        variant="outline-success"
        onClick={() => setToggleShowNewSubEntry(!toggleShowNewSubEntry)}
      >
        {toggleShowNewSubEntry ? 'Cancel' : 'Add Subentry'}
      </Button>

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


