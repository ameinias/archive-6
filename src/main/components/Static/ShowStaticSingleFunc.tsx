import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';
import { Link } from 'react-router-dom';

export function ShowStaticSingle({ itemID }: { itemID?: number }) {
  const { id } = useParams(); // get the id from the route
  const item = useLiveQuery(() => db.friends.get(Number(itemID)), [itemID]);
  const navigate = useNavigate();



  // const { isAdmin } = GameLogic();
  // const { setStatusMessage } = GameLogic();

  // // Initialize form values - if an ID came through, get that. If not, default empty.



  // useEffect(() => {
  //   async function fetchData() {
  //     if (!itemID) {
  //           if (window.confirm(`ID not found, returning to list.`)) {
  //             navigate('/');
  //           }
  //       return;
  //     }

  //     const entry = await db.friends.get(Number(itemID));
  //     if (entry) {
  //       console.log('Fetched entry:', entry);
  //       setStatusMessage(
  //         'Fetched entry:' +
  //           entry.fauxID
  //       );
  //     }

  //   }
  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [itemID]);

  // const entry = useLiveQuery(async () => {
  //   if (!itemID) return [];

  //   const parentId = Number(itemID);
  //   if (isNaN(parentId) || parentId <= 0) return [];

  //   try {
  //     return await db.subentries.where('parentId').equals(parentId).toArray();
  //   } catch (error) {
  //     console.error('Error fetching subentries:', error);
  //     return [];
  //   }
  // }, [itemID]) || [];

    // Use useLiveQuery to automatically update when database changes
const subEntryOfParent = useLiveQuery(() => {

  return db.subentries.where('parentId').equals(Number(itemID)).toArray();
}, [itemID]) || [];

  if (!item) return <div>Loading...</div>;


  return (
    <div className="List">
      {/* {friend.map((item) => ( */}
      <div key={item.id}>
        <div>
          {' '}
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
          
                    <div>

            {subEntryOfParent.map((item) => (
              <div key={item.id}>
                <div width="80%">
                  <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                    {item.fauxID} : {item.title}
                  </Link>
                </div>
                <div className={`subentry-${item.id}`}>
                  {item.description} - 
                  {item.researcherID} | {item.entryDate ? new Date(item.entryDate).toLocaleDateString() : 'No date'}
                </div>
              </div>
            ))}

        </div>
          <hr />
          <br />  
          <b>Thumbnail:</b> <br />
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
      </div>
    </div>
  );
}
