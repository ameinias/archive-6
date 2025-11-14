import React, { useEffect, useState } from 'react';
import { db } from '@utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate, Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { MediaThumbnail } from '@components/parts/Media/MediaThumbnail.jsx';
import { eventManager } from '@utils/events';

const Media = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [replacingMediaId, setReplacingMediaId] = useState(null);
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
          mediaId: mediaItem.id,
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
          mediaId: mediaItem.id,
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
        const friend = await db.friends.get(entryId);
        if (friend && friend.media) {
          const updatedMedia = friend.media.filter(id => id !== mediaId);
          await db.friends.update(entryId, { media: updatedMedia });
        }
      } else if (entryType === 'sub') {
        const subentry = await db.subentries.get(entryId);
        if (subentry && subentry.mediaSub) {
          const updatedMedia = subentry.mediaSub.filter(id => id !== mediaId);
          await db.subentries.update(entryId, { mediaSub: updatedMedia });
        }
      }

      findMedia();
    } catch (error) {
      console.error('Error removing media reference:', error);
    }
  };

  const replaceMedia = async (mediaId) => {
    // Store which media we're replacing
    setReplacingMediaId(mediaId);
    
    // Trigger file picker
    const fileInput = document.getElementById('replace-media-input');
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleReplaceFileSelected = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !replacingMediaId) return;

    try {
      const oldMedia = await db.media.get(replacingMediaId);
      if (!oldMedia) {
        throw new Error('Original media not found');
      }

      console.log(' Replacing media:', oldMedia.name, 'with:', file.name);

      // Process the new file
      const arrayBuffer = await file.arrayBuffer();
      
      if (eventManager.isElectron) {
        // Delete old file from disk
        if (oldMedia.path && window.electronAPI?.deleteMediaFile) {
          await window.electronAPI.deleteMediaFile(oldMedia.path);
        }

        // Save new file to disk
        const result = await window.electronAPI.saveMediaFile(file.name, arrayBuffer);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        // Update database record with new file info
        await db.media.update(replacingMediaId, {
          name: file.name,
          type: file.type,
          size: file.size,
          path: result.path,
          uploadedAt: new Date()
        });

        
        
      } else {
        // Web: Replace blob
        const blob = new Blob([arrayBuffer], { type: file.type });
        
        await db.media.update(replacingMediaId, {
          name: file.name,
          type: file.type,
          size: file.size,
          blob: blob,
          uploadedAt: new Date()
        });

       
      }

      // Clear the replacing state
      setReplacingMediaId(null);
      
      // Clear the file input
      event.target.value = '';
      
      // Refresh the list
      findMedia();
      
    } catch (error) {
      console.error(' Error replacing media:', error);
      alert(`Error replacing file: ${error.message}`);
      setReplacingMediaId(null);
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

      {/* Hidden file input for replacing media */}
      <input
        type="file"
        id="replace-media-input"
        accept="image/*,video/*,audio/*,application/pdf"
        onChange={handleReplaceFileSelected}
        style={{ display: 'none' }}
      />

      {sortedMedia.length === 0 ? (
        <div className="subentry-add-list">
          <p>No media files found in any entries.</p>
        </div>
      ) : (
        <div className="subentry-add-list">
          {sortedMedia.map((mediaFile, index) => (
            <div className="media-thumbnail-list" key={index}>
              <MediaThumbnail 
                fileRef={mediaFile.mediaId}
                maxWidth={'700px'}
              /> 

              <div className="image-subinfo">
                
                {mediaFile.uploadedAt && (
                  <>Uploaded: {new Date(mediaFile.uploadedAt).toLocaleDateString()}<br /></>
                )}
                
                {mediaFile.type !== 'orphan' ? (
                  <>
                    {mediaFile.type === 'main' ? 'Entry' : 'Sub Entry'}: <Link to={`/${mediaFile.type === 'main' ? 'entry' : 'subentry'}/${mediaFile.entryId}`}>
                      {mediaFile.fauxID} - {mediaFile.entryTitle}
                    </Link>
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
                      Unlink
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
                    Delete
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