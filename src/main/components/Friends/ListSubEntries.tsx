import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export function ListSubEntries({ itemID }: { itemID?: number }) {
  const [savedID, setSavedID] = useState<number>(0);
  const navigate = useNavigate();
  const [subEntryOfParent, setSubEntryOfParent] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!itemID ) {
        console.log('not valid parent: ', itemID);
        setSavedID(0);
        setSubEntryOfParent([]);
        return;
      }


      // Validate that itemID can be converted to a valid number
      const parentId = Number(itemID);

      console.log('what happans here: ', parentId, " ", itemID);

      if (isNaN(parentId) || parentId <= 0) {
        console.log('Invalid parent ID: ', itemID);
        setSavedID(0);
        setSubEntryOfParent([]);
        return;
      }

      console.log('valid parent: ', itemID);
      setSavedID(parentId);
      setSubEntryOfParent([]);

      try {
        const entries = await db.subentries.where('parentId').equals(parentId).toArray();
        if (entries && entries.length > 0) {
          setSubEntryOfParent(entries);
          console.log('Fetched subentries: ', entries);
        } else {
          console.log('No subentries found for parent ID: ', itemID);
          setSubEntryOfParent([]);
        }
      } catch (error) {
        console.error('Error fetching subentries:', error);
        setSubEntryOfParent([]);
      }
    }
    fetchData();
  }, [itemID]);

  const removeItem = async (item: any) => {
    try {
      await db.subentries.delete(item.id);
      console.log('Removing item: ', item.title);
      // Refresh the list after deletion
      setSubEntryOfParent(prev => prev.filter(entry => entry.id !== item.id));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const editItem = (item: any) => {
    navigate(`/edit-item/${item.id}`);
    console.log('Edit item: ', item.id);
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
                  {item.id} <Link to={`/edit-subitem/${item.id}`}>
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
    </div>
  );
}


