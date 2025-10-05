import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import * as FormAssets from '../Components/FormAssets';

import {
  MediaCountCell,
  SubentryCountCell,
  AvailableCell,
} from '../../components/Components/Badges';

export function EntryList() {
    const [isLoading, setIsLoading] = useState(false);
  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const navigate = useNavigate();
  const gameLogic = GameLogic();
    const { setStatusMessage } = GameLogic();
  const [editingHex, setEditingHex] = useState(null); // Track which item is being edited
  const [tempHexValue, setTempHexValue] = useState(''); // Temporary value while editing

  const startEditingHex = (item) => {
    setEditingHex(item.id);
    // Convert current hexHash to string for editing
    const currentValue = item.hexHash 
      ? (Array.isArray(item.hexHash) ? item.hexHash.join(', ') : item.hexHash.toString())
      : '';
    setTempHexValue(currentValue);
  };


  const saveHexHash = async (itemId, type) => {
    try {
      // Convert comma-separated string back to array
      const hexArray = tempHexValue
        .split(',')
        .map(hex => hex.trim())
        .filter(hex => hex.length > 0);
      
        if(type === 'subentry') {
          await db.subentries.update(itemId, { 
            hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null
          });
        } else {
          await db.friends.update(itemId, { 
            hexHash: hexArray.length > 1 ? hexArray : hexArray[0] || null 
          });
        }

      setEditingHex(null);
      setTempHexValue('');
      setStatusMessage('Hex hash updated successfully');
    } catch (error) {
      console.error('Error updating hex hash:', error);
      setStatusMessage('Error updating hex hash');
    }
  };

  const cancelEditingHex = () => {
    setEditingHex(null);
    setTempHexValue('');
  };

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




  // --------------------  Remove Entries
  const removeItem = async (item) => {
    if (await window.electronAPI.showConfirm(`Are you sure you want to delete "${item.title}"?`)) {
      db.friends.delete(item.id);
      setStatusMessage(`Entry ${item.title} successfully deleted.`);
    }
  };

  const removeSubentry = async (item) => {
    if (await window.electronAPI.showConfirm(`Are you sure you want to delete "${item.title}"?`)) {
      db.subentries.delete(item.id);
      setStatusMessage(`Removing subentry: ${item.title}`);
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





  if (isLoading || !friends || !subentries) {
    return (
      <div className="List">
        <h3>Loading...</h3>
      </div>
    );
  }



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
                <th>Hex</th>
                <th>Subs</th>
                <th>Media</th>
                <th>Active</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {sortedFriends.map((item) => (
                <tr key={item.id}>
                  <td width="70%" data-label="name">
                    <Link to={`/edit-item/${item.id}`}>
                      {item.fauxID} : {item.title}
                    </Link>
                    </td>
                <td data-label="hex">
      {editingHex === item.id ? (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <input
            type="text"
            value={tempHexValue}
            onChange={(e) => setTempHexValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveHexHash(item.id, 'entry');
              if (e.key === 'Escape') cancelEditingHex();
            }}
            placeholder="Enter hex values (comma separated)"
            style={{ flex: 1, padding: '2px 5px' }}
            autoFocus
          />
          <Button
            size="sm"
            variant="success"
            onClick={() => saveHexHash(item.id, 'entry')}
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
          </Button>
        </div>
      ) : (
        <div 
          onClick={() => startEditingHex(item)}
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
                <th> Hex</th>
                <th>Media</th>
                <th>Active</th>
                <th>Remove</th>
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
                                  <td data-label="hex">
      {editingHex === item.id ? (
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <input
            type="text"
            value={tempHexValue}
            onChange={(e) => setTempHexValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveHexHash(item.id, 'subentry');
              if (e.key === 'Escape') cancelEditingHex();
            }}
            placeholder="Enter hex values (comma separated)"
            style={{ flex: 1, padding: '2px 5px' }}
            autoFocus
          />
          <Button
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
          </Button>
        </div>
      ) : (
        <div 
          onClick={() => startEditingHex(item)}
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
