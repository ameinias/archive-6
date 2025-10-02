import React, { useEffect, useState } from 'react';
import { db, dbMainEntry, bothEntries } from '../../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { SearchResults } from './Searchresults';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';
import {getFileType} from '../../../hooks/dbHooks';
// interface MediaFile {
//   id: number;
//   name: string;
//   size?: number;
//   type: 'main' | 'sub';
//   entryId: number;
//   entryTitle: string;
//   fauxID: string;
//   file?: File; // For actual file objects
//   url?: string; // For stored file paths
// }

const Media = () => {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const gameLogic = GameLogic();

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());

  useEffect(() => {
    findMedia();
  }, [friends, subentries]);

  const findMedia = () => {
    let tempMediaFiles: MediaFile[] = [];
    let nextID = 0;


    const entriesWithMedia = friends?.filter(
      (item) => item.media && item.media.length > 0

    );

    const subEntriesWithMedia = subentries?.filter(
      (item) => item.mediaSub && item.mediaSub.length > 0
    );

    // Add media from main entries
    if (entriesWithMedia) {
      for (const item of entriesWithMedia) {
        if (item.media) {
          for (const mediaFile of item.media) {
            tempMediaFiles.push({
              id: nextID,
              name: mediaFile.name || `Media ${nextID}`,
              size: mediaFile.size,
              type: 'main',
              entryId: item.id,
              entryTitle: item.title,
              fauxID: item.fauxID,
              file: mediaFile, // Store the actual file
            });
            nextID = nextID + 1;
          }
        }
      }
    }

    // Add media from sub entries
    if (subEntriesWithMedia) {
      for (const subItem of subEntriesWithMedia) {
        if (subItem.mediaSub) {
          for (const mediaFile of subItem.mediaSub) {
            tempMediaFiles.push({
              id: nextID,
              name: mediaFile.name || `SubMedia ${nextID}`,
              size: mediaFile.size,
              type: 'sub',
              entryId: subItem.id,
              entryTitle: subItem.title,
              fauxID: subItem.fauxID,
              file: mediaFile, // Store the actual file
            });
            nextID = nextID + 1;
          }
        }
      }
    }

    setMediaFiles(tempMediaFiles);
  };

  const removeMediaFile = (mediaId: number) => {
    setMediaFiles(mediaFiles.filter(file => file.id !== mediaId));
  };

  // const getFileType = (filename: string): 'image' | 'video' | 'other' => {
  //   const ext = filename.toLowerCase().split('.').pop();
  //   const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  //   const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

  //   if (imageExts.includes(ext || '')) return 'image';
  //   if (videoExts.includes(ext || '')) return 'video';
  //   return 'other';
  // };

    // Sort media by date
  const sortedMedia = mediaFiles
    ? [...mediaFiles].sort((a, b) => {
        const dateA = a.size ? new Date(a.size).getTime() : 0;
        const dateB = b.size ? new Date(b.size).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  return (
    <>
      <h1>Media Files</h1>
      <p>Total media files: {mediaFiles.length}</p>

      {sortedMedia.length === 0 ? (
        <div className="subentry-add-list">
          <p>No media files found in any entries.</p>
        </div>
      ) : (
        <div className="subentry-add-list">
          {sortedMedia.map((mediaFile) => (
            <div className="media-thumbnail" key={mediaFile.id}>
              {/* Display image/video if it's a File object */}
              {mediaFile.file && getFileType(mediaFile.name) === 'image' && (
                <img
                  src={URL.createObjectURL(mediaFile.file)}
                  alt={mediaFile.name}
                  style={{ width: '100%', height: 'auto', maxWidth: '200px' }}
                  onLoad={() => URL.revokeObjectURL(URL.createObjectURL(mediaFile.file!))}
                />
              )}

              {mediaFile.file && getFileType(mediaFile.name) === 'video' && (
                <video
                  src={URL.createObjectURL(mediaFile.file)}
                  controls
                  style={{ width: '100%', height: 'auto', maxWidth: '200px' }}
                />
              )}

              <div className="image-subinfo">
                <strong>{mediaFile.name}</strong><br />
                {mediaFile.size && `Size: ${(mediaFile.size / 1024).toFixed(2)} KB`}<br />
                From: <Link to={`/${mediaFile.type === 'main' ? 'entry' : 'subentry'}/${mediaFile.entryId}`}>
                  {mediaFile.fauxID} - {mediaFile.entryTitle}
                </Link><br />
                Type: {mediaFile.type === 'main' ? 'Main Entry' : 'Sub Entry'}
              </div>

              {gameLogic.isAdmin && (
                <Button
                  className="remove-button button-small remove-button-small"
                  onClick={() => removeMediaFile(mediaFile.id)}
                  variant="danger"
                  size="sm"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Media;
