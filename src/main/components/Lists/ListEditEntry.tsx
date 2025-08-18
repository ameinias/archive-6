import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';

export function EntryList() {
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();
  const gameLogic = GameLogic();

  const removeItem = (item: any) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      db.friends.delete(item.id);
      console.log('Removing item: ', item.title);
    }
  };

  const removeSubentry = (item: any) => {
    if (window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      db.subentries.delete(item.id);
      console.log('Removing subentry: ', item.title);
    }
  };

  // Sort friends by date
  const sortedFriends = friends
    ? [...friends].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  return (
    <div className="List">
      <h3>Entries:</h3>

      <table className="entryTable">
        <tbody>
          {sortedFriends.length === 0 ? (
            <tr>
              <td colSpan={3}>No Entries!<br/>Hit <Link to="/import-export">Admin</Link> / New Game to get the starter database while work in progress.</td>
            </tr>
          ) : (<>
          {sortedFriends.map((item) => (
            <tr key={item.id}>
              <td width="80%">
                <Link to={`/edit-item/${item.id}`}>
                  {item.fauxID} : {item.title}
                </Link>
                </td><td>
                   {item.media?.length > 0 ? (
                  <div className="note">{item.media?.length}</div>) : null}</td>

                <td>{item.date ? new Date(item.date).toLocaleDateString() : 'No date'}

              </td>
              <td>
                {' '}
                <Button
                  className="remove-button button-small remove-button-small"
                  onClick={() => removeItem(item)}
                >               </Button>
              </td>
            </tr>
          ))}
          </>
          )}
        </tbody>
      </table>

      <h3>Subentries:</h3>
      <table className="entryTable">
        <tbody>
          {subentries?.map((item) => (
            <tr key={item.id}>
              <td width="80%">
                <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                  {item.fauxID} : {item.title}
                </Link>
              </td>
              <td>
                {' '}
                <Button
                  className="remove-button button-small remove-button-small"
                  onClick={() => removeSubentry(item)}
                ></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
