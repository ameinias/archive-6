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
            // ✅ Get media:// URL from Electron
            const url = await window.electronAPI.getMediaPath(mediaFile.path);
            console.log('📁 Media URL:', url);
            setMediaUrl(url); // ✅ Changed from setBlobUrl
          } 
          else if (mediaFile.blob) {
            // Web: use blob
            const url = URL.createObjectURL(mediaFile.blob);
            setMediaUrl(url); // ✅ Changed from setBlobUrl
          }
        }
      } else if (fileRef instanceof File) {
        // ✅ Handle File objects (before saving)
        setFileName(fileRef.name);
        setFileSize(fileRef.size);
        setFileType(fileRef.type);
        const url = URL.createObjectURL(fileRef);
        setMediaUrl(url);
      }
    };
  loadMedia();


    return () => {
      // Only revoke blob: URLs, not media: URLs
    if (mediaUrl && mediaUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mediaUrl);
    } 
  };
}, [fileRef]);

  if (!mediaUrl) {
    return <div>No mediaUrl. Loading media...</div>;
  }

if (mediaUrl) {

  if (fileType?.startsWith('video/')) {
    return (
       <div className="media media-video">
          
          <video controls style={{ width: '100%', maxWidth: {maxWidth}, height: 'auto' }}>
          <source src={mediaUrl} type={fileType} />
          Your browser does not support the video tag.
        </video>
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>

      </div>
    );
  }

  else if (fileType?.startsWith('image/')) {
    return (
      <div className="media media-img">
        <img src={mediaUrl} alt={fileName} style={{ width: '100%', height: 'auto' }} />
        <span className="image-subinfo">
          {fileName} ({(fileSize / 1024).toFixed(2)} KB)
        </span>

      </div>
    );
  } 
  
  else if (fileType?.startsWith('application/pdf')) {
   // const pdfURL = {mediaUrl} + "#toolbar=0";
    
        return (
               <div className="media media-pdf">
          <object data={mediaUrl} type="application/pdf" style={{ width: '100%', height: '500px' }} >
            <p>PDF cannot be displayed.</p>
          </object>

{/* <embed
  src="https://example.com/test.pdf"
  type="application/pdf"
  width="100%"
  height="500px"
/> */}
          {/* <iframe
  src={mediaUrl ? `${mediaUrl}#toolbar=0` : ''} // mediaUrl

  title="Non-downloadable PDF Viewer"
></iframe> */}

          
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );

       } 
       
       
      else if (fileType?.startsWith('audio/')) {
          return (
        <div className="media media-audio">
          <audio controls style={{ width: '100%'}}>
            <source src={mediaUrl}  />
            Your browser does not support the audio tag.
          </audio>
          <br></br>
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );
    } 
      
    

      return (
        <div className="media">
          <p>Unsupported file type: {fileType}</p>
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );
    }

  return (
    <div>
       
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

    </div>
  );

};