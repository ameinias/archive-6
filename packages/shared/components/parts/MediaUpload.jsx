import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { db } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useActionState } from 'react';
import {eventManager} from '@utils/events';
import { MediaThumbnail } from '@components/parts/MediaThumbnail.jsx';

export function MediaUpload({ mediaFiles }) {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState([]);
  const { setStatusMessage } = GameLogic();
  const gameLogic = GameLogic();


  useEffect(() => {
    setFiles(mediaFiles || []);
  }, [mediaFiles]);

  // Define the event handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleImport = async (file) => {
    try {
      if (!file) throw new Error(`Only files can be dropped here`);

      const maxSizeInMB = 50;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`);
      }

     
      const blobRef = await processMediaToBlobs(file);
      
      const newFiles = [...(mediaFiles || []), blobRef];
      setFiles(newFiles);
      
      // Update the parent's mediaFiles array
      if (mediaFiles) {
        mediaFiles.length = 0; 
        mediaFiles.push(...newFiles); 
      }

      console.log('File imported: ', file.name);
      console.log('Total files: ', newFiles.length);
      setStatusMessage(`File imported: ${file.name}`);
    } catch (error) {
      console.error('Import error:', error);
      setStatusMessage(`Error importing file: ${error.message}`);
      return;
    }
  };

  const processMediaToBlobs = async (file) => {
  try {
    const mediaId = await db.media.add({
      name: file.name,
      type: file.type,
      size: file.size,
      blob: file, 
      uploadedAt: new Date()
    });


    return `blob:${mediaId}`;
  } catch (error) {
    console.error('Error saving media to database:', error);
    throw error;
  }
};



  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImport(file);
    }
  };
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    // Update the parent's mediaFiles array
    if (mediaFiles) {
      mediaFiles.length = 0; // Clear existing
      mediaFiles.push(...newFiles); // Add remaining files
    }
  };


  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    const mediaFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith('image/') || file.type.startsWith('video/'),
    );
    setFiles(mediaFiles);
    setStatusMessage(
      `Files dropped: ${mediaFiles.map((file) => file.name).join(', ')}`,
    );
  };

  return (
    <div>
      {files.length === 0 ? (
        <div className="subentry-add-list">
          {gameLogic.isAdmin ? <>No Attachments.</> : <></>}
        </div>
      ) : (
        <div className="subentry-add-list">
          {files.map((file, index) => (
            <div className="media-thumbnail" key={index}>

          
                        <MediaThumbnail 
              key={index}
              fileRef={file}
 
              maxWidth={'700px'}
              onRemove={removeFile}
            /> 
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '5px'}}>
              <Button
                className="image-edit-button"
                
                onClick={() => removeFile(index)}
              >
                x
              </Button>
              {/* 
              Adding a rename button is not a good use of my time right now. 
              <Button
                className="image-edit-button"
                onClick={() => renameFile(index)}
                
              >
                rename
              </Button> */}
              </div>

            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*,video/*, audio/*, application/pdf"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        id="fileInput"
      />

      <Button
        className="btn-add-item"
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        Import Attachments
      </Button>
    </div>
  );
}
