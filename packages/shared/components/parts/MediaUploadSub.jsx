import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { db } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useActionState } from 'react';
import {eventManager} from '@utils/events';
import { MediaThumbnail } from '@components/parts/MediaThumbnail.jsx';

export function MediaUploadSub({ mediaSubFiles }) {
  const [isOver, setIsOver] = useState(false);
  const [subFiles, setSubFiles] = useState([]);
  const { setStatusMessage } = GameLogic();
  const gameLogic = GameLogic();


  useEffect(() => {
    setSubFiles(mediaSubFiles || []);
  }, [mediaSubFiles]);

  // Define the event handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleImport = async (subFiles) => {
    try {
      if (!subFiles) throw new Error(`Only files can be dropped here`);

      const maxSizeInMB = 50;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (subFiles.size > maxSizeInBytes) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`);
      }

     
      const blobRef = await processMediaToBlobs(subFiles);
      
      const newSubFiles = [...(mediaSubFiles || []), blobRef];
      setSubFiles(newSubFiles);
      
      // Update the parent's mediaSubFiles array
      if (mediaSubFiles) {
        mediaSubFiles.length = 0; 
        mediaSubFiles.push(...newSubFiles); 
      }

      console.log('File imported: ', subFiles.name);
      console.log('Total files: ', newSubFiles.length);
      setStatusMessage(`File imported: ${subFiles.name}`);
    } catch (error) {
      console.error('Import error:', error);
      setStatusMessage(`Error importing file: ${error.message}`);
      return;
    }
  };

  const processMediaToBlobs = async (subFiles) => {
  try {
    const mediaId = await db.media.add({
      name: subFiles.name,
      type: subFiles.type,
      size: subFiles.size,
      blob: subFiles, 
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
      console.log('File input changed, file selected:', file.name);
    }
  };
  const removeFile = (index) => {
    const newSubFiles = subFiles.filter((_, i) => i !== index);
    setSubFiles(newSubFiles);
    // Update the parent's mediaSubFiles array
    if (mediaSubFiles) {
      mediaSubFiles.length = 0; // Clear existing
      mediaSubFiles.push(...newSubFiles); // Add remaining files
    }
  };


  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    const mediaSubFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith('image/') || file.type.startsWith('video/'),
    );
    setSubFiles(mediaSubFiles);
    setStatusMessage(
      `Files dropped: ${mediaSubFiles.map((file) => file.name).join(', ')}`,
    );
  };

  return (
    <div>
      {subFiles.length === 0 ? (
        <div className="subentry-add-list">
          {gameLogic.isAdmin ? <>No Attachments.</> : <></>}
        </div>
      ) : (
        <div className="subentry-add-list">
          {subFiles.map((subFiles, index) => (
            <div className="media-thumbnail" key={index}>

          
                        <MediaThumbnail 
              key={index}
              fileRef={subFiles}
 
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
        id="fileInputSub"
      />

      <Button
        className="btn-add-item"
        onClick={() => document.getElementById('fileInputSub')?.click()}
      >
        Import Attachments
      </Button>
    </div>
  );
}
