import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db, dbHelpers } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import {
  MediaCountCell,
  SubentryCountCell,
  AvailableCell,
} from '../../components/Components/Badges';

export function EntryList() {
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();
  const gameLogic = GameLogic();
  //const { subEntryOfParentLQ } = ListSubEntries();

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
<>

      {sortedFriends.length === 0 ? 
      (
        <div className="List">
        <table className="entryTable">
          <tbody>
            <tr>
              <td colSpan={3}>
                No Entries!
                <br />
                Hit <Link to="/import-export">Admin</Link> / New Game to get the
                starter database while work in progress.

                      <Link to="/edit-item/new"><Button
              className="btn-add-item">
              New Entry
            </Button>
            </Link>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
      ) : (
        <>
    <div className="List">
      <h3>Entries:</h3>
      <Link to="/edit-item/new"><Button
              className="btn-add-item">
              New Entry
            </Button>
            </Link>
          <table className="entryTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subs</th>
                <th>Media</th>
                <th>Active</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {sortedFriends.map((item) => (
                <tr key={item.id}>
                  <td width="80%" data-label="name">
                    <Link to={`/edit-item/${item.id}`}>
                      {item.fauxID} : {item.title}
                    </Link>
                  </td>
                  <td data-label="subentries">
                    <SubentryCountCell parentId={item.id} />
                  </td>
                  <td data-label="media">
                    <MediaCountCell itemId={item.id} type="entry" />
                  </td>
                  <td data-label="currentlyavailable">
                    <AvailableCell itemId={item.id} type="entry" />
                  </td>

                  <td data-label="remove">
                    {' '}
                    <Button
                      className="remove-button button-small remove-button-small"
                      onClick={() => removeItem(item)}
                    >
                      {' '}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
    <div className="List">
          <h3>Subentries:</h3>
          <table className="entryTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>-</th>
                <th>Media</th>
                <th>Active</th>
                <th>Remove</th>
              </tr>
            </thead>

            <tbody>
              {subentries?.map((item) => (
                <tr key={item.id}>
                  <td width="80%" data-label="title">
                    <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                      {item.fauxID} : {item.title}
                    </Link>
                  </td>
                  <td></td>
                  <td data-label="media">
                    <MediaCountCell itemId={item.id} type="subentry" />
                  </td>
                  <td data-label="available">
                    <AvailableCell itemId={item.id} type="subentry" />
                  </td>

                  <td data-label="remove">
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
  </>
      )}
       </>
  );
 
}
