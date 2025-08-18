import React, { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { db, dbHelpers } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';
import { Link } from 'react-router-dom';

export function StaticSubListItem({
  itemID,
  parentID,
}: {
  itemID?: string;
  parentID?: string;
}) {
  const { id } = useParams(); // get the id from the route
  const gameState = GameLogic();
  const navigate = useNavigate();
  const [statusMessage, setStatusMessage] = useState<string>('');

 // Helper function to determine if file is image or video
function getFileType(filename: string): 'image' | 'video' | 'other' {
  const ext: string | undefined = filename.toLowerCase().split('.').pop();
  const imageExts: string[] = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const videoExts: string[] = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

  if (imageExts.includes(ext || '')) return 'image';
  if (videoExts.includes(ext || '')) return 'video';
  return 'other';
}

  const item = useLiveQuery(async () => {
    if (!id) return null;
    return await db.subentries.get(Number(id));
  }, [id]);

    if (!item) {
    return <div>Loading...</div>;
  }

  if(item.available === false) {
    return <div className="subEntry-not-available"><b>{item.fauxID} : </b> *****NOT AVAILABLE : DATA CORRUPTED*******</div>;
  }

  return (
    <div className={`List ${gameState.gameState.level > 0? 'haunted' : ''}`}>

          
        <div className='subentry-item'>
              <div key={item.id}>
                <div width="80%">
                  <Link to={`/edit-subitem/${item.parentId}/${item.id}`}>
                    {item.fauxID} : {item.title}
                  </Link>
                </div>
                <div className={`subentry-${item.id}`}>
                  {item.description}
                  {item.mediaSub?.map((item) => (
                    <div key={item.id}>
                      <Link to={`/file-fullscreen/entry-${item.id}`}>
                        {item.name}
                      </Link>
                    </div>
                  ))}

                  <br />
                  <span className='image-subinfo subinfo'  >
                  - {item.researcherID.toString()}  ({item.entryDate ? new Date(item.entryDate).toLocaleDateString() : 'No date'})
                  </span>
                </div>
              </div>
            
            </div>
        </div>
        
        ) // return
}
