import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { db } from '@utils/db';
import { eventManager } from '@utils/events';
import { Link } from 'react-router-dom';
import { PdfViewer } from './pdfVeiwer';

export const MediaThumbnail = ({ fileRef, onRemove, maxWidth }) => {
  const [mediaDataUrl, setMediaDataUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMedia = async () => {

      
      try {
        // Case 1: fileRef is a number (database ID)
        if (typeof fileRef === 'number') {

          const mediaFile = await db.media.get(fileRef);
          
          if (mediaFile) {
            // console.log(' File details:', {
            //   name: mediaFile.name,
            //   type: mediaFile.type,
            //   size: mediaFile.size,
            //   path: mediaFile.path
            // });

            setFileName(mediaFile.name);
            setFileSize(mediaFile.size);
            setFileType(mediaFile.type);

            //  Electron: Load via IPC
            if (mediaFile.path && eventManager.isElectron && window.electronAPI?.getMediaData) {
              const { data, mimeType } = await window.electronAPI.getMediaData(mediaFile.path);
              const dataUrl = `data:${mimeType};base64,${data}`;
              setMediaDataUrl(dataUrl);

            } 
            // Web: use blob
            else if (mediaFile.blob) {

              const url = URL.createObjectURL(mediaFile.blob);
              setMediaDataUrl(url);
            }
          }
        } 
        // Case 2: fileRef is a File object (preview before saving)
        else if (fileRef instanceof File) {
          console.log('📁 File object preview:', fileRef.name);
          setFileName(fileRef.name);
          setFileSize(fileRef.size);
          setFileType(fileRef.type);
          const url = URL.createObjectURL(fileRef);
          setMediaDataUrl(url);
        }
      } catch (error) {
        console.error('❌ Failed to load media:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMedia();

    return () => {
      // Cleanup blob URLs
      if (mediaDataUrl && mediaDataUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mediaDataUrl);
      }
    };
  }, [fileRef]);



  // Loading state fs
  if (loading) {
    return (
      <div style={{
        width: '200px',
        height: '150px',
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed #ccc'
      }}>
        <span>Loading...</span>
      </div>
    );
  }

  // No media URL
  if (!mediaDataUrl) {
    return <div>Failed to load media</div>;
  }

  // VIDEO
  if (fileType?.startsWith('video/')) {
    return (
      <div className="media media-video">
        <video 
          controls 
          preload="metadata"
          style={{ 
            width: '100%', 
            maxWidth: maxWidth || '500px', 
            height: 'auto', 
            backgroundColor: '#000' 
          }}
          onError={(e) => {
            console.error('❌ Video error:', {
              error: e.target.error,
              code: e.target.error?.code,
              message: e.target.error?.message,
              src: e.target.src
            });
          }}
        >
          <source src={mediaDataUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024 / 1024).toFixed(2)} MB)
        </span>
      </div>
    );
  }

  // AUDIO
  if (fileType?.startsWith('audio/')) {
    return (
      <div className="media media-audio">
        <audio 
          controls
          preload="metadata"
          style={{ width: '100%', maxWidth: maxWidth || '500px' }}
          onError={(e) => {
            console.error('❌ Audio error:', {
              error: e.target.error,
              code: e.target.error?.code,
              src: e.target.src
            });
          }}
        >
          <source src={mediaDataUrl} type={fileType} />
          Your browser does not support the audio tag.
        </audio>
        <br />
        <span className="image-subinfo">   
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>
      </div>
    );
  }

  // IMAGE
  if (fileType?.startsWith('image/')) {
    return (
      <div className="media media-img">
        <img 
          src={mediaDataUrl} 
          alt={fileName} 
          style={{ width: '100%', height: 'auto' }} 
        />
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>
      </div>
    );
  }
  
  
  //pdf
// PDF - Simple version without pdf.js
if (fileType === 'application/pdf') {
  return (
    <div className="media media-pdf">
                  <embed
              src={mediaDataUrl}
              type="application/pdf"
              style={{ 
                width: '100%', 
                height: '600px',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}
            />
    </div>
  );
}

  // Unsupported
  return (
    <div className="media">
      <p>Unsupported file type: {fileType}</p>
      <span className="image-subinfo">
        <Link to={mediaDataUrl}>
          {fileName}
        </Link> ({(fileSize / 1024).toFixed(2)} KB)
      </span>
    </div>
  );
};