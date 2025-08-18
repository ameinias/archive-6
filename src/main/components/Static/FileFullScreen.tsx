import { useParams } from 'react-router-dom';
import { GameLogic } from '../../utils/gamelogic';
import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../utils/db';

// Helper function to determine file type synchronously
const getFileType = (filename: string): 'image' | 'video' | 'other' => {
  const ext = filename.toLowerCase().split('.').pop();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const videoExts = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];

  if (imageExts.includes(ext || '')) return 'image';
  if (videoExts.includes(ext || '')) return 'video';
  return 'other';
};

const FileFullscreen = () => {
  const { fileID } = useParams<{ fileID: string }>(); // Get fileID from route params
  const { isAdmin } = GameLogic();
  const navigate = useNavigate();
  const [fileType, setFileType] = useState<'image' | 'video' | 'other'>('other');
  const [entryId, setEntryId] = useState<number | null>(null);
  const [mediaIndex, setMediaIndex] = useState<number | null>(null);
  const [entryType, setEntryType] = useState<string | null>(null);


  // FIXED: Parse the fileID to get entryId and mediaIndex
  useEffect(() => {
    if (!fileID) {
      console.error('No fileID provided');
      return;
    }

    // Split fileID by '-' to get two variables
    const parts = fileID.split('-');
    if (parts.length !== 3) {
      console.error('Invalid fileID format. Expected: type-entryId-mediaIndex');
      return;
    }

    const parsedEntryType = parts[0];
    const parsedEntryId = parseInt(parts[1]);
    const parsedMediaIndex = parseInt(parts[2]);

    if (isNaN(parsedEntryId) || isNaN(parsedMediaIndex)) {
      console.error('Invalid fileID format. Both parts must be numbers');
      return;
    }

    setEntryType(parsedEntryType);
    setEntryId(parsedEntryId);
    setMediaIndex(parsedMediaIndex);
  }, [fileID]);

    // Alternative back function using window.history
  const handleBackClickAlt = () => {
    navigate(`/entry/${entryId}`);
    //window.history.back();
  };

  // Get the entry from database using the parsed entryId
  const entry = useLiveQuery(() => {
    if (entryId === null) return null;
    return db.friends.get(entryId);
  }, [entryId]);

  // Get the specific file from the media array using mediaIndex
  const file = entry?.media?.[mediaIndex || 0];


  // FIXED: Determine file type when file is available
  useEffect(() => {
    if (file?.name) {
      const detectedFileType = getFileType(file.name);
      setFileType(detectedFileType);
    }
  }, [file]);

  const isFile = file instanceof File;

  return (
    <>
      <div className="file-fullscreen-topbar">


        <Button variant="outline-primary" style={{ width: '25px', padding:'2px' }} onClick={handleBackClickAlt}>
          {'<<'}
        </Button>{' '}



        <div style={{ marginLeft: '10px' }}>
          {entryId && mediaIndex !== null && (
            <span>Type: {entryType} | Entry: {entryId} | Media: {mediaIndex + 1}</span>
          )}
        </div>
      </div>
      <div className="file-fullscreen-content">
        {file ? (
          <>
            {isFile && fileType === 'image' ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{
                  width: '100%',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  height: 'auto',
                  objectFit: 'contain'
                }}
                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
              />
            ) : isFile && fileType === 'video' ? (
              <video
                controls
                style={{
                  width: '100%',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  height: 'auto'
                }}
              >
                <source src={URL.createObjectURL(file)} />
                Your browser does not support the video tag.
              </video>
            ) : file.dataUrl && fileType === 'image' ? (
              // Handle stored image data
              <img
                src={file.dataUrl}
                alt={file.name || 'Image'}
                style={{
                  width: '100%',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            ) : file.dataUrl && fileType === 'video' ? (
              // Handle stored video data
              <video
                controls
                style={{
                  width: '100%',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  height: 'auto'
                }}
              >
                <source src={file.dataUrl} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <div className="file-placeholder">
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>📎</div>
                <div>{file.name || 'Unknown File'}</div>
              </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <strong>{file.name || 'Unknown File'}</strong>
              <br />
              {file.size && (
                <small>({(file.size / 1024).toFixed(2)} KB)</small>
              )}
            </div>
          </>
        ) : entryId === null || mediaIndex === null ? (
          <div>Invalid file ID format. Expected: entryId-mediaIndex. Got {entryId}-{mediaIndex} && {fileID}     ========== {fileID}</div>
        ) : !entry ? (
          <div>Entry not found.</div>
        ) : (
          <div>Media file not found at index {mediaIndex}.</div>
        )}
      </div>
    </>
  );
};

export default FileFullscreen;
