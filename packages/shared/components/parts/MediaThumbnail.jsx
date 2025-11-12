import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { db } from '@utils/db'; // import the database

export const MediaThumbnail = ({ fileRef, onRemove, maxWidth }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [fileName, setfileName] = useState("");
   const [fileSize, setfileSize] = useState();
   const [fileType, setfileType] = useState("");

  //  const [fileType, setfileType] = useState("");

  useEffect(() => {
    
    const loadBlob = async () => {
      if (typeof fileRef === 'string' && fileRef.startsWith('blob:')) {
        //  Extract ID from blob reference
        const mediaId = parseInt(fileRef.replace('blob:', ''));
        const mediaFile = await db.media.get(mediaId);
        
        if (mediaFile && mediaFile.blob) {
          const url = URL.createObjectURL(mediaFile.blob);
          setBlobUrl(url);
          setfileName(mediaFile.name);
          setfileSize(mediaFile.size);
          setfileType(mediaFile.type);
          console.log(mediaId.size)
        }
      }
    };

    loadBlob();

    // Cleanup blob URL on unmount
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [fileRef]);



  if (fileRef instanceof File) {
    return (
      <div className="media-thumbnail">
        fileref
        <img
          src={URL.createObjectURL(fileRef)}
          alt={fileRef.name}
          style={{ width: '100%', height: 'auto' }}
        /> 
        <span className="image-subinfo">
          {fileRef.name} ({(fileRef.size / 1024).toFixed(2)} KB)
        </span> 

       </div>
    );
  }

  if (blobUrl) {
    
    if (fileType?.startsWith('video/')) {
      return (
        <div>
          
          <video controls style={{ width: '100%', maxWidth: {maxWidth}, height: 'auto' }}>
            <source src={blobUrl}  />
            Your browser does not support the video tag.
          </video>
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );
    } else if (fileType?.startsWith('image/')) {
      return (
        <div>
          <img src={blobUrl} alt={fileName} style={{ width: '100%', height: 'auto' }} />
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );
    } else {
      return (
        <div >
          <p>Unsupported file type: {fileType}</p>
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );
    }
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