import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export function StaticList() {
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();

  // Sort friends by date
  const sortedFriends = friends
    ? [...friends]
    .filter(item => item.available === true)
    .sort((a, b) => {
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
              <td colSpan={2}>No Entries!<br/>Hit <Link to="/import-export">Admin</Link> / New Game to get the starter database while work in progress.</td>
            </tr>
          ) : (
            sortedFriends.map((item) => (
              <tr key={item.id}>
                <td width="80%">
                  <Link to={`/entry/${item.id}`}>
                    {item.fauxID} : {item.title}
                  </Link>
                </td>
                <td>{item.date ? new Date(item.date).toLocaleDateString() : 'No date'}</td>
              </tr>
            )))}
        </tbody>
      </table>
    </div>
  );
}
