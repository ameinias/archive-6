import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { db } from '@utils/db'; // import the database
import { eventManager} from '@utils/events';

export const MediaThumbnail = ({ fileRef, onRemove, maxWidth }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    const loadMedia = async () => {
      if (typeof fileRef === 'number') {
        // ✅ It's a media ID, load from database
        const mediaFile = await db.media.get(fileRef);
        
        if (mediaFile) {
          setFileName(mediaFile.name);
          setFileSize(mediaFile.size);
          setFileType(mediaFile.type);

          if (mediaFile.path && eventManager.isElectron) {
            // ✅ Electron: Get file:// URL from path
            const url = await window.electronAPI.getMediaPath(mediaFile.path);
            setMediaUrl(url);
          } else if (mediaFile.blob) {
            // ✅ Web: Create blob URL
            const url = URL.createObjectURL(mediaFile.blob);
            setMediaUrl(url);
          }
        }
      }
    };

    loadMedia();

    return () => {
      if (mediaUrl && mediaUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mediaUrl);
      }
    };
  }, [fileRef]);

  if (!mediaUrl) {
    return <div>No mediaUrl. Loading media...</div>;
  }

  if (fileType?.startsWith('video/')) {
    return (
      <div className="media-thumbnail">
        <video controls style={{ width: '100%', maxWidth: '500px' }}>
          <source src={mediaUrl} type={fileType} />
        </video>
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>
        {onRemove && (
          <Button className="remove-button" onClick={onRemove}>×</Button>
        )}
      </div>
    );
  }

  if (fileType?.startsWith('image/')) {
    return (
      <div className="media-thumbnail">
        <img src={mediaUrl} alt={fileName} style={{ width: '100%' }} />
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>
        {onRemove && (
          <Button className="remove-button" onClick={onRemove}>×</Button>
        )}
      </div>
    );
  }

  return <div>Unsupported file type: {fileType}</div>;
};