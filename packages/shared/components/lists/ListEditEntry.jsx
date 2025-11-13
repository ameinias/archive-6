import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GameLogic } from '@utils/gamelogic';
import * as FormAssets from '@components/parts/FormAssets';
import { researcherIDs } from '@utils/constants';
import * as EditableFields from '@components/parts/EditableFields';

import {
  MediaCountCell,
  SubentryCountCell,
  AvailableCell,
} from '@components/parts/Badges';
import { eventManager } from '@utils/events';


export function EntryList() {
  // TODO: Clean these up. I think a lot of these aren't needed anymore.

    const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();
  const { setStatusMessage } = GameLogic();
  
  const [isLoading, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  
  const [editingHex, setEditingHex] = useState(null);
  const [editingSubHex, setEditingSubHex] = useState(null);
  const [tempHexValue, setTempHexValue] = useState('');
  const [tempSubHexValue, setTempSubHexValue] = useState('');



   const sortedFriends = useLiveQuery(
    () => {
      if (!sortColumn) return db.friends.toArray();
      
      const query = db.friends.orderBy(sortColumn);
      return sortDirection === 'desc' ? query.reverse().toArray() : query.toArray();
    },
    [sortColumn, sortDirection]
  );

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };


  const startEditingHex = (item, type) => {
    // Convert current hexHash to string for editing
    const currentValue = item.hexHash
      ? (Array.isArray(item.hexHash) ? item.hexHash.join(', ') : item.hexHash.toString())
      : '';

        if (type === 'entry') {
          setTempHexValue(currentValue);
    setEditingHex(item.id);
  } else {
    setTempSubHexValue(currentValue);
    setEditingSubHex(item.id);
  }

  };


  const saveHexHash = async (itemId, type) => {
    try {
      // Convert comma-separated string back to array


        if(type === 'subentry') {
                const hexArray = tempSubHexValue
        .split(',')
        .map(hex => hex.trim())
        .filter(hex => hex.length > 0);

          await db.subentries.update(itemId, {
            hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null
          });
                setEditingSubHex(null);
                setTempSubHexValue('');
        } else {
                const hexArray = tempHexValue
        .split(',')
        .map(hex => hex.trim())
        .filter(hex => hex.length > 0);

          await db.friends.update(itemId, {
            hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null
          });
                setEditingHex(null);
                setTempHexValue('');
        }


      setStatusMessage(itemId + ' Hex hash updated successfully');
    } catch (error) {
      console.error('Error updating hex hash:', error);
      setStatusMessage('Error updating hex hash');
    }
  };

  const cancelEditingHex = () => {
    setEditingHex(null);
    setEditingSubHex(null);
    setTempHexValue('');
    setTempHexValue('');


  };

  //  function MySortableTable() {
  //     const [items, setItems] = useState([]);
  //     const [sortColumn, setSortColumn] = useState('name');
  //     const [sortDirection, setSortDirection] = useState('asc');
  //  };

      // useEffect(() => {
      //   const fetchItems = async () => {
      //     let sortedItems;
      //     if (sortDirection === 'asc') {
      //       sortedItems = await db.friends.orderBy(sortColumn).toArray();
      //     } else {
      //       sortedItems = await db.friends.orderBy(sortColumn).reverse().toArray();
      //     }
      //     setItems(sortedItems);
      //   };
      //   fetchItems();
      // }, [sortColumn, sortDirection]); // Re-fetch when sort order changes



useEffect(() => {
    const handleNewGameStart = () => setIsLoading(true);
    const handleNewGameEnd = () => {
      setIsLoading(false);
      // Force component refresh after new game
      window.location.reload(); // Simple but effective
    };

    window.addEventListener('newGameStart', handleNewGameStart);
    window.addEventListener('newGameEnd', handleNewGameEnd);

    return () => {
      window.removeEventListener('newGameStart', handleNewGameStart);
      window.removeEventListener('newGameEnd', handleNewGameEnd);
    };
  }, []);


      //   const handleSort = (column) => {
      //   if (column === sortColumn) {
      //     setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      //   } else {
      //     setSortColumn(column);
      //     setSortDirection('asc'); // Default to ascending when changing column
      //   }
      // };


  // --------------------  Remove Entries
  const removeItem = async (item) => {
    if (await eventManager.showConfirm(`Are you sure you want to delete "${item.title}"?`)) {
      db.friends.delete(item.id);
      setStatusMessage(`Entry ${item.title} successfully deleted.`);
    }
  };

  const removeSubentry = async (item) => {
    if (await eventManager.showConfirm(`Are you sure you want to delete "${item.title}"?`)) {
      db.subentries.delete(item.id);
      setStatusMessage(`Removing subentry: ${item.title}`);
    }
  };

  // // Sort friends by date
  // const sortedFriends = friends
  //   ? [...friends].sort((a, b) => {
  //       const dateA = a.date ? new Date(a.date).getTime() : 0;
  //       const dateB = b.date ? new Date(b.date).getTime() : 0;
  //       return dateB - dateA;
  //     })
  //   : [];

  //   // Sort friends by date
  // const sortedFriends = friends
  //   ? [...friends].sort((a, b) => {
  //       const dateA = a.date ? new Date(a.date).getTime() : 0;
  //       const dateB = b.date ? new Date(b.date).getTime() : 0;
  //       return dateB - dateA;
  //     })
  //   : [];





  if (isLoading || !friends || !subentries) {
    return (
      <div className="List">
        <h3>Please wait while database populates...</h3>
      </div>
    );
  }



  return (
<>

      {!sortedFriends ||sortedFriends.length === 0 ?
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
<div className="div">
                      <Link to="/edit-item/new"><Button
              className="btn-add-item">
              New Entry
            </Button>
            </Link>
            </div>
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
          <table className="searchResults">
            <thead>
              <tr>

                <th onClick={() => handleSort('title')}>
                  Title {sortColumn === 'title' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                
  
                <th onClick={() => handleSort('displayDate')}>
                  Display Date {sortColumn === 'displayDate' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                
                   <th onClick={() => handleSort('date')}>
                  Added Date {sortColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th width="25px">Hex</th>
                <th width="25px" title="sub entries">Subs</th>
                <th width="25px" title="media attachments">🖼️</th>
                <th width="25px" title="active">🔛</th> 
                <th width="25px">🗑️</th>
              </tr>
            </thead>
            <tbody>
              {sortedFriends.map((item) => (
                <tr key={item.id}>
                  <td  data-label="name">
                    <Link to={`/edit-item/${item.id}`}>
                      {item.fauxID} : {item.title}
                    </Link>
                    </td>
                    <td width="50px" data-label="displayDate">
                                          <td>{item.displayDate ? new Date(item.displayDate).toLocaleDateString('en-US', { month: 'numeric', year: 'numeric' }) : 'No Date'}</td>
                    </td>
                   < td width="50px" data-label="date">
                                          {item.date ? new Date(item.date).toLocaleDateString('en-US') : 'No Date'}
                    </td>
                <td data-label="hex">
      {editingHex === item.id ? (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', width: '40px' }}>
          <input
            type="text"
            name="hexedit"
            title="hexedit"
            value={tempHexValue}
            onChange={(e) => setTempHexValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveHexHash(item.id, 'entry');
              if (e.key === 'Escape') cancelEditingHex();
            }}
            placeholder="hexes"
            style={{ flex: 1, padding: '2px 5px', width: '40px' }}
            autoFocus
          />
        </div>
      ) : (
        <div
          onClick={() => startEditingHex(item, 'entry')}
          style={{
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '3px',
            ':hover': { backgroundColor: '#f0f0f0' }
          }}
          title="Click to edit"
        >
          {item.hexHash ? (
            Array.isArray(item.hexHash)
              ? item.hexHash.join(', ')
              : item.hexHash.toString()
          ) : 'None (click to add)'}
        </div>
      )}
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
                    <button
                      className="remove-button-small" aria-label="Close"
                      onClick={() => removeItem(item)}
                    >
                      x
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
    <div className="List">
          <h3>Subentries:</h3>
          <table className="searchResults">
            <thead>
              <tr>
                                <th onClick={() => handleSort('title')}>
                  Title {sortColumn === 'title' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                
  
                <th onClick={() => handleSort('displayDate')}>
                  Display Date {sortColumn === 'displayDate' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                
                   <th onClick={() => handleSort('date')}>
                  Added Date {sortColumn === 'date' && (sortDirection === 'asc' ? '▲' : '▼')}
                </th>
                <th width="75px">Researcher</th>
                <th width="25px"> Hex</th>
                <th width="25px">🖼️</th>
                <th width="25px">🔛</th>
                <th width="25px">🗑️</th>
              </tr>
            </thead>

            <tbody>
              {subentries?.map((item) => (
                <tr key={item.id}>
                  <td width="70%" data-label="title">
                    <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                      {item.fauxID} : {item.title}
                    </Link>
                  </td>
                  <td>
                     {item.displayDate ? (
                             typeof item.displayDate === 'string'
                               ? item.displayDate
                               : new Date(item.displayDate).toLocaleDateString()
                           ) : 'No date'}
                           {/*  Below isn't working yet. Taking a break. TODO */}
                       {/* <EditableFields.EditDate itemID={item.id} type="subentry" /> */}
                          </td>
                                          < td width="50px" data-label="date">
                                          <td>{item.date ? new Date(item.date).toLocaleDateString('en-US') : 'No Date'}</td>
                    </td>
                          <td>

                         <EditableFields.EditResearcher itemID={item.id} type="subentry" />
                         </td>
                                  <td data-label="hexChild">
      {editingSubHex === item.id ? (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', width: '40px' }}>
          <input
            type="text"
                        name="hexeditChild"
            title="hexeditChild"
            value={tempSubHexValue}
            onChange={(e) => setTempSubHexValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveHexHash(item.id, 'subentry');
              if (e.key === 'Escape') cancelEditingHex();
            }}
            placeholder="Enter hex values (comma separated)"
            style={{ flex: 1, padding: '2px 5px', width: '40px' }}
            autoFocus
          />
          {/* <Button
            size="sm"
            variant="success"
            onClick={() => saveHexHash(item.id, 'subentry')}
            style={{ padding: '2px 8px' }}
          >
            ✓
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={cancelEditingHex}
            style={{ padding: '2px 8px' }}
          >
            ✕
          </Button> */}
        </div>
      ) : (
        <div
          onClick={() => startEditingHex(item, 'subentry')}
          style={{
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '3px',
            ':hover': { backgroundColor: '#f0f0f0' }
          }}
          title="Click to edit"
        >
          {item.hexHash ? (
            Array.isArray(item.hexHash)
              ? item.hexHash.join(', ')
              : item.hexHash.toString()
          ) : 'None'}
        </div>
      )}
                  </td>
                  <td data-label="media">
                    <MediaCountCell itemId={item.id} type="subentry" />
                  </td>
                  <td data-label="available">
                    <AvailableCell itemId={item.id} type="subentry" />
                  </td>

                  <td data-label="remove">
                    {' '}
                    <button
                      className="remove-button-small"
                      onClick={() => removeSubentry(item)}
                    >x</button>
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
