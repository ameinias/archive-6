import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useRef } from 'react';
import { db, dbHelpers } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { Link } from 'react-router-dom';
import {MediaDisplay} from './Media/MediaDisplay'
import { researcherIDs } from '@utils/constants';
import { MediaThumbnail } from '@components/parts/Media/MediaThumbnail.jsx';
import { BookMarkCheck } from '@components/parts/Badges';

export function StaticSubListItem({
  itemID,
  parentID
}) {
  const { id } = useParams(); // get the id from the route
  const gameState = GameLogic();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState('');
  const [freshUnread, setFreshUnread] = useState(true);
  const itemRef = useRef(null);

  const item = useLiveQuery(async () => {
    if (!itemID) return null;
    return await db.subentries.get(Number(itemID));
  }, [itemID]);

  useEffect(() => {
  // Mark as read when user navigates away
  return () => {
    if (!item || !item.available || !item.unread) return;
    
    console.log(item.fauxID + " marking as read on unmount");
    db.subentries.update(Number(itemID), { unread: false });
    // Note: Don't await in cleanup, it's synchronous
  };
}, [item, itemID]); // Runs cleanup when component unmounts

  if (!item) {
    return <div>Loading...</div>;
  }

  if (item.available === false) {
    return (
      <div 
      ref={itemRef}
      className="subentry-staticentry subEntry-not-available"> 
        <span className="subIDSpan"><h3>{item.fauxID} </h3> </span> 
        <span>*****NOT AVAILABLE : DATA CORRUPTED*******</span> {freshUnread ?  <>freshunread</> : <>!freshunread</> } 
      </div>
    );
  }



  return (
    <div
ref={itemRef} 
      className={`subentry-staticentry ${gameState.gameState.level > 0 ? 'haunted' : ''} ${item.unread ? 'unread-display' : 'dickie' }`}
    >
      <div className="subentry-item">
        {/* <div > */}
          <div width="80%"      key={item.id} >
          {/* {item.unread ?  <span className="unread-indicator" title="New Subentry Unread">Unread </span> : <>read</> } {freshUnread ?  <>freshunread</> : <>!freshunread</> }  */}
              {' '}
              {/* <Link to={`/edit-subitem/${item.parentId}/${item.id}`}> */}

             
              <div className="subentry-title">
                <div style={{}}><BookMarkCheck itemID={item.id} type="subentry" /></div>
                <span className="subID">{item.fauxID} 
                  </span> 
                  <span className="subTitle">{item.title}</span>
                  </div>
              {/* </Link> */}
           
          </div>
          <div className="subentry-desc">
            {item.description}
            {item.mediaSub?.map((file, index) => (
              <div key={index}>

                                              <MediaThumbnail 
              key={index}
              fileRef={file}
              maxWidth={'700px'}
              
            /> 
              </div>
            ))}

            <br />
            <span className="image-subinfo subinfo">
         {item.displayDate ? (
           typeof item.displayDate === 'string' 
             ? item.displayDate 
             : new Date(item.displayDate).toLocaleDateString()
         ) : 'No date'}
     
        - {item.researcherID !== null && item.researcherID !== undefined
         ? researcherIDs.find(researcher => researcher.id === parseInt(item.researcherID))?.name || 'Unknown'
         : 'Unknown User'
       }
              
            </span>
          </div>
        </div>
      </div>
  ); // return
}
