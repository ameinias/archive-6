import React, { useEffect, useState } from 'react';
import { db } from '@utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { MediaThumbnail } from '@components/parts/MediaThumbnail.jsx';
import { eventManager } from '@utils/events';

const Media = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const gameLogic = GameLogic();

  const friends = useLiveQuery(() => db.friends.toArray());
  const subentries = useLiveQuery(() => db.subentries.toArray());
  const allMedia = useLiveQuery(() => db.media.toArray());

  useEffect(() => {
    findMedia();
  }, [friends, subentries, allMedia]);

  const findMedia = () => {
    if (!allMedia || !friends || !subentries) return;

    let tempMediaFiles = [];
    let nextID = 0;

    // Find which entries reference each media file
    for (const mediaItem of allMedia) {
      // Check friends (main entries) for this media
      const friendsWithMedia = friends.filter(
        (friend) => friend.media && friend.media.includes(mediaItem.id)
      );

      // Check subentries for this media
      const subentriesWithMedia = subentries.filter(
        (subentry) => subentry.mediaSub && subentry.mediaSub.includes(mediaItem.id)
      );

      // Add entry for each friend that references this media
      for (const friend of friendsWithMedia) {
        tempMediaFiles.push({
          id: nextID++,
          mediaId: mediaItem.id, // Reference to db.media
          name: mediaItem.name,
          size: mediaItem.size,
          type: 'main',
          entryId: friend.id,
          entryTitle: friend.title,
          fauxID: friend.fauxID,
          uploadedAt: mediaItem.uploadedAt,
        });
      }

      // Add entry for each subentry that references this media
      for (const subentry of subentriesWithMedia) {
        tempMediaFiles.push({
          id: nextID++,
          mediaId: mediaItem.id, // Reference to db.media
          name: mediaItem.name,
          size: mediaItem.size,
          type: 'sub',
          entryId: subentry.id,
          entryTitle: subentry.title,
          fauxID: subentry.fauxID,
          uploadedAt: mediaItem.uploadedAt,
        });
      }

      // If media isn't referenced anywhere, still show it
      if (friendsWithMedia.length === 0 && subentriesWithMedia.length === 0) {
        tempMediaFiles.push({
          id: nextID++,
          mediaId: mediaItem.id,
          name: mediaItem.name,
          size: mediaItem.size,
          type: 'orphan',
          entryId: null,
          entryTitle: 'Not attached to any entry',
          fauxID: null,
          uploadedAt: mediaItem.uploadedAt,
        });
      }
    }

    setMediaFiles(tempMediaFiles);
  };

  const removeMediaFile = async (mediaId, entryId, entryType) => {
    try {
      if (entryType === 'main') {
        // Remove from friend's media array
        const friend = await db.friends.get(entryId);
        if (friend && friend.media) {
          const updatedMedia = friend.media.filter(id => id !== mediaId);
          await db.friends.update(entryId, { media: updatedMedia });
        }
      } else if (entryType === 'sub') {
        // Remove from subentry's mediaSub array
        const subentry = await db.subentries.get(entryId);
        if (subentry && subentry.mediaSub) {
          const updatedMedia = subentry.mediaSub.filter(id => id !== mediaId);
          await db.subentries.update(entryId, { mediaSub: updatedMedia });
        }
      }

      // Refresh the list
      findMedia();
    } catch (error) {
      console.error('Error removing media reference:', error);
    }
  };


  const replaceMedia = async (mediaId, entryId, entryType) => {
  try {
      if (entryType === 'main') {
        // Remove from friend's media array
        const friend = await db.friends.get(entryId);
        if (friend && friend.media) {
          const updatedMedia = friend.media.filter(id => id !== mediaId);
          await db.friends.update(entryId, { media: updatedMedia });
        }
      } else if (entryType === 'sub') {
        // Remove from subentry's mediaSub array
        const subentry = await db.subentries.get(entryId);
        if (subentry && subentry.mediaSub) {
          const updatedMedia = subentry.mediaSub.filter(id => id !== mediaId);
          await db.subentries.update(entryId, { mediaSub: updatedMedia });
        }
      }

      // Refresh the list
      findMedia();
    } catch (error) {
      console.error('Error removing media reference:', error);
    }
  };
  
  const deleteMediaCompletely = async (mediaId) => {
    try {
      const mediaItem = await db.media.get(mediaId);
      
      if (!mediaItem) return;

      // Remove references from all entries
      const friendsToUpdate = friends.filter(f => f.media && f.media.includes(mediaId));
      const subentriesToUpdate = subentries.filter(s => s.mediaSub && s.mediaSub.includes(mediaId));

      for (const friend of friendsToUpdate) {
        await db.friends.update(friend.id, {
          media: friend.media.filter(id => id !== mediaId)
        });
      }

      for (const subentry of subentriesToUpdate) {
        await db.subentries.update(subentry.id, {
          mediaSub: subentry.mediaSub.filter(id => id !== mediaId)
        });
      }

      // Delete physical file if in Electron
      if (window.electronAPI?.deleteMediaFile && mediaItem.path) {
        await window.electronAPI.deleteMediaFile(mediaItem.path);
      }

      // Delete from database
      await db.media.delete(mediaId);

      console.log('✅ Media deleted completely');
    } catch (error) {
      console.error('❌ Error deleting media:', error);
    }
  };

  // Sort media by upload date
  const sortedMedia = mediaFiles
    ? [...mediaFiles].sort((a, b) => {
        const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  return (
    <>
      <h1>Media Files</h1>
      <p>Total media references: {mediaFiles.length}</p>
      <p>Unique media files: {allMedia?.length || 0}</p>

      {sortedMedia.length === 0 ? (
        <div className="subentry-add-list">
          <p>No media files found in any entries.</p>
        </div>
      ) : (
        <div className="subentry-add-list">
          {sortedMedia.map((mediaFile, index) => (
            <div className="media-thumbnail" key={index}>
              <MediaThumbnail 
                fileRef={mediaFile.mediaId}
                maxWidth={'700px'}
              /> 

              <div className="image-subinfo">
                <strong>{mediaFile.name}</strong><br />
                {mediaFile.size && `Size: ${(mediaFile.size / 1024).toFixed(2)} KB`}<br />
                {mediaFile.uploadedAt && (
                  <>Uploaded: {new Date(mediaFile.uploadedAt).toLocaleDateString()}<br /></>
                )}
                
                {mediaFile.type !== 'orphan' ? (
                  <>
                    From: <Link to={`/${mediaFile.type === 'main' ? 'entry' : 'subentry'}/${mediaFile.entryId}`}>
                      {mediaFile.fauxID} - {mediaFile.entryTitle}
                    </Link><br />
                    Type: {mediaFile.type === 'main' ? 'Main Entry' : 'Sub Entry'}
                  </>
                ) : (
                  <span style={{ color: '#999' }}>
                    Not attached to any entry
                  </span>
                )}
              </div>

              {gameLogic.isAdmin && (
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  {mediaFile.type !== 'orphan' && (
                    <Button
                      className="remove-button button-small remove-button-small"
                      onClick={() => removeMediaFile(mediaFile.mediaId, mediaFile.entryId, mediaFile.type)}
                      variant="warning"
                      size="sm"
                    >
                      Unlink from Entry
                    </Button>
                  )}
                  
                  <Button
                    className="remove-button button-small remove-button-small"
                    onClick={() => {
                      if (eventManager.showConfirm(`Delete "${mediaFile.name}" completely? This will remove it from all entries and cannot be undone.`)) {
                        deleteMediaCompletely(mediaFile.mediaId);
                      }
                    }}
                    variant="danger"
                    size="sm"
                  >
                    Delete Completely
                  </Button>
                                    <Button
                    className="remove-button button-small remove-button-small"
                    onClick={() => {
                      if (eventManager.showConfirm(`Replace "${mediaFile.name}" ?`)) {
                        replaceMedia(mediaFile.mediaId);
                      }
                    }}
                    variant="danger"
                    size="sm"
                  >
                    Replace
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Media;