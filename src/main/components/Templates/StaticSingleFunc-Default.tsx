import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db, dbHelpers } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';
import { Link } from 'react-router-dom';
import { StaticSubListItem } from '../Components/StaticSubListItem';
import { BookMarkCheck } from '../Components/Badges';
import {MediaDisplay} from '../Components/MediaDisplay'

export function StaticSingleDefault({ itemID }: { itemID?: number }) {
  const { id } = useParams(); // get the id from the route
  const gameState = GameLogic();

  const item = useLiveQuery(() => {
    const numericID = Number(itemID);
    if (!itemID || isNaN(numericID) || numericID <= 0) {
      console.warn('Invalid itemID for database query:', itemID);
      return null;
    }
    return db.friends.get(numericID);
  }, [itemID]);

  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState<string>('');

  const subEntryOfParent =
    useLiveQuery(() => {
      const numericID = Number(itemID);
      if (!itemID || isNaN(numericID) || numericID <= 0) {
        return [];
      }
      return db.subentries.where('parentId').equals(numericID).toArray();
    }, [itemID]) || [];


    

  if (item === undefined) {
    return <div>Loading...</div>;
  }

  if (item === null) {
    return (
      <div>
        <h2>Item not found</h2>
        <p>The requested item {itemID} could not be found in the database.</p>
        <Button variant="primary" onClick={() => navigate('/')}>
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div className={`List ${gameState.gameState.level > 0 ? 'haunted' : ''}`}>
      {/* {friend.map((item) => ( */}
      <div key={item.id}>
        <div>
          {' '}
          <BookMarkCheck itemID={item.id} type="entry" />
          <h2>
            {item.fauxID} : {item.title}
          </h2>
        </div>
        <div>
          <b>Category:</b> {item.category}{' '}
        </div>
        <div>
          <b>Description:</b> <br />
          {item.description} <hr />
          <section title="Media">
            {' '}
            {/* Show media entries if they exist */}
            <br />
            <b>Media:</b>
            <div className="subentry-add-list">
              {!item.media || item.media.length === 0 ? (
                <>No Attachments.</>
              ) : (
                <>
                  <table>
                    <tbody>
                      {item.media.map((file, index) => {
                        return(
                          <tr key={index}>
                        <td>
                       <MediaDisplay file={file} index={index}/>

                         
                                {file.name} ({(file.size / 1024).toFixed(2)} KB)
                          
                            </td>
                            
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </section>{' '}
          {/* Show subentries if they exist */}
          <div title="Subentries">
            {subEntryOfParent.map((item) => (
              <div key={item.id}>
                <StaticSubListItem itemID={item.id} parentID={item.parentId} />
              </div>
            ))}
          </div>
        </div>{' '}
        <div>
          <span>
            <b>Actual Entry Date:</b>{' '}
            {item.date ? new Date(item.date).toLocaleString() : 'No date'}{' '}
          </span>{' '}
        </div>{' '}
        <div>
          <span>
            {' '}
            <b>Fictional date:</b>
            {item.entryDate
              ? new Date(item.entryDate).toLocaleString()
              : 'No entry date'}
          </span>
        </div>
      </div>{' '}
      {/* item.id */}
    </div>
  );
}
