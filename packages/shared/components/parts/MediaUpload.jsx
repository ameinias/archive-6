import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '@utils/gamelogic';
import { db } from '@utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';
import { useActionState } from 'react';

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

      const newFiles = [...(mediaFiles || []), file];
      setFiles(newFiles);
      // Update the parent's mediaFiles array
      if (mediaFiles) {
        mediaFiles.length = 0; // Clear existing
        mediaFiles.push(...newFiles); // Add all files
      }
      console.log('File imported: ', file.name);
      console.log('Total files: ', newFiles.length);
      setStatusMessage(`File imported: ${file.name}`);
    } catch (error) {
      setStatusMessage('An unknown error occurred during import.');
      return;
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

              {file instanceof File ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ width: '100%', height: 'auto' }}
                />
              ) : (
                <div style={{
                  width: '200px',
                  height: '150px',
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px dashed #ccc'
                }}>
                  <span>📁 {file.name || 'Saved File'}</span>
                </div>
              )}
              <span className="image-subinfo">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </span>
              <Button
                className="remove-button button-small remove-button-small"
                onClick={() => removeFile(index)}
              >

              </Button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*,video/*"
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
