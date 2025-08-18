import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { GameLogic } from '../../utils/gamelogic';
import { db } from '../../utils/db'; // import the database
import { useLiveQuery } from 'dexie-react-hooks';

export function MediaUpload({ mediaFiles }: { mediaFiles: File[] }) {
  const [isOver, setIsOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { setStatusMessage } = GameLogic();
  const gameLogic = GameLogic();


  useEffect(() => {
    setFiles(mediaFiles);
  }, [mediaFiles]);

  // Define the event handlers
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsOver(false);
  };

  const handleImport = async (file: File) => {
    try {
      if (!file) throw new Error(`Only files can be dropped here`);

      const maxSizeInMB = 50;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new Error(`File size must be less than ${maxSizeInMB}MB`);
      }

      //setFiles((prev) => [...prev, file]);
      mediaFiles.push(file);
      console.log('File imported: ', file.name);
      console.log('Total files: ', mediaFiles.length);
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
  const removeFile = (index:number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
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
      <div className="subentry-add-list">
        {files.length === 0 ? (
          <>No Attachments.</>
        ) : (
          <>

                {files.map((file, index) => (
                  <div className="media-thumbnail" key={index}>

                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        style={{ width: '100%', height: 'auto' }}
                      />
                     <span className="image-subinfo"> {file.name} ({(file.size / 1024).toFixed(2)} KB)</span>{' '}
                      <Button
                        className="remove-button button-small remove-button-small"
                        onClick={() => removeFile(index)}
                      >                      </Button>
                    </div>
                ))}
                </>
        )}
      </div>

      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <Button
        className="btn-add-item"
        onClick={() => document.getElementById('fileInput').click()}
      >
        Import Attachments
      </Button>
    </div>
  );
}
