import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../../../packages/shared/utils/gamelogic';
import { db } from '../../../../packages/shared/utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';

export function MediaUploadSub({ mediaSubFiles }) {
  const [isOver, setIsOver] = useState(false);
  const [subFiles, setSubFiles] = useState([]);
  const { setStatusMessage } = GameLogic();

  useEffect(() => {
    setSubFiles(mediaSubFiles);
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

      //setFiles((prev) => [...prev, file]);
      mediaSubFiles.push(subFiles);
      console.log('File imported: ', subFiles.name);
      console.log('Total files: ', mediaSubFiles.length);
      setStatusMessage(`File imported: ${subFiles.name}`);
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

  const handleDrop = (event) => {
    event.preventDefault();
    setIsOver(false);

    // Fetch the files
    const droppedFiles = Array.from(event.dataTransfer.files);
    const mediaFiles = droppedFiles.filter(
      (file) =>
        file.type.startsWith('image/') || file.type.startsWith('video/'),
    );
    setSubFiles(mediaFiles);
    setStatusMessage(
      `Files dropped: ${mediaFiles.map((file) => file.name).join(', ')}`,
    );
  };

  return (
    <div>
      <div className="subentry-add-list">
        {subFiles.length === 0 ? (
          <>No Attachments.</>
        ) : (
          <>
            <table>
              <tbody>
                {subFiles.map((subFiles, index) => (
                  <tr key={index}>
                    <td width="80%">
                      <img
                        src={URL.createObjectURL(subFiles)}
                        alt={subFiles.name}
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <span className="image-subinfo">
                        {' '}
                        {subFiles.name} ({(subFiles.size / 1024).toFixed(2)} KB)
                      </span>{' '}
                      <Button
                        className="remove-button button-small remove-button-small"
                        onClick={() =>
                          setSubFiles(subFiles.filter((_, i) => i !== index))
                        }
                      >
                        {' '}
                      </Button>
                    </td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        id="fileInputSub"
      />
      <Button
        className="btn-add-item"
        onClick={() => document.getElementById('fileInputSub').click()}
      >
        Import Attachments
      </Button>
    </div>
  );
}
