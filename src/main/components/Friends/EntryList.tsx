import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export function FriendList() {
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  // const [friends, delEntry] = useState([]);
    const navigate = useNavigate();

  const removeItem = (item: any) => {
    db.friends.delete(item.id);
    // delEntry();
    console.log('Removing item: ', item.title);
  };

    const editItem = (item: any) => {
    // db.friends.delete(item.id);
      navigate(`/edit-item/${item.id}`);

    console.log('Edit item: ', item.id);
  };

  return (
    <div className="List">
      <table>
        <tbody>
        {friends?.map((item) => (
          <tr key={item.id}>
            <td width="80%">
              {item.id}: <Link to={`/edit-item/${item.id}`}>
               {item.fauxID} : {item.title}</Link>
            </td>
            <td >
              {' '}
              <Button variant="outline-danger" onClick={() => removeItem(item)}>
                R
              </Button>


            </td>
          </tr>
        ))}
        </tbody>
      </table>

      Subentries:
       <table>
        <tbody>
        {subentries?.map((item) => (
          <tr key={item.id}>
            <td width="80%">
              {item.id}: <Link to={`/edit-subitem/${item.id}`}>
               {item.fauxID} : {item.title}</Link> Parent: {item.parentId }
            </td>
            <td >
              {' '}
              <Button variant="outline-danger" onClick={() => removeItem(item)}>
                R
              </Button>


            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}
