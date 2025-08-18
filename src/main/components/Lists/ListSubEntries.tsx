import React, { useState, useEffect } from 'react';
import { db, dbSubEntry, dbHelpers } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AddSubEntryForm } from '../Admin/AddSubEntryFunc';

export function ListSubEntries({ itemID }: { itemID?: number }) {
  const [toggleShowNewSubEntry, setToggleShowNewSubEntry] = useState(false);
  const navigate = useNavigate();
  //const [subEntryOfParent, setSubEntries] = useState<dbSubEntry[]>([]);


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
          <table>
            <tbody>
              {subEntryOfParentLQ.map((item) => (
                <tr key={item.id}>
                               <> This is what I added: {item.id}  | {item.parentId}
                       
                              </>
                  <td width="80%">
                    <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                      {item.fauxID} : {item.title}
                    </Link>
                  </td>
                  <td>
                    <Button
                      variant="remove-button"
                      onClick={() => removeItem(item)}
                    ></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
