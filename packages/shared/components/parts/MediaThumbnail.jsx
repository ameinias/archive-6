import { DragEvent, useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { db } from '@utils/db'; // import the database
import { eventManager} from '@utils/events';
import { Link } from 'react-router-dom';

export const MediaThumbnail = ({ fileRef, onRemove, maxWidth }) => {
  const [mediaUrl, setMediaUrl] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileType, setFileType] = useState('');




  
  useEffect(() => {
    const loadMedia = async () => {
      if (typeof fileRef === 'number') {
     
        const mediaFile = await db.media.get(fileRef);
        
        if (mediaFile) {
                  // ✅ Add debug logging
        console.log('📁 File details:', {
          name: mediaFile.name,
          type: mediaFile.type,
          size: mediaFile.size,
          path: mediaFile.path
        });

          setFileName(mediaFile.name);
          setFileSize(mediaFile.size);
          setFileType(mediaFile.type);

 if (mediaFile.path && eventManager.isElectron) {

            const url = await window.electronAPI.getMediaPath(mediaFile.path);
            console.log('📁 Media URL:', url);
            setMediaUrl(url); 
          } 
          else if (mediaFile.blob) {
            // Web: use blob
            const url = URL.createObjectURL(mediaFile.blob);
            setMediaUrl(url); 
          }
        }
      } else if (fileRef instanceof File) {
        
        setFileName(fileRef.name);
        setFileSize(fileRef.size);
        setFileType(fileRef.type);
        const url = URL.createObjectURL(fileRef);
        setMediaUrl(url);
      }
    };
  loadMedia();

const video = document.createElement('video');
  const audio = document.createElement('audio');
  
  console.log('🎬 Supported video formats:');
  console.log('  MP4 (H.264):', video.canPlayType('video/mp4; codecs="avc1.42E01E"'));
  console.log('  WebM (VP8):', video.canPlayType('video/webm; codecs="vp8"'));
  console.log('  WebM (VP9):', video.canPlayType('video/webm; codecs="vp9"'));
  console.log('  Ogg (Theora):', video.canPlayType('video/ogg; codecs="theora"'));
  console.log('  QuickTime:', video.canPlayType('video/quicktime'));
  
  console.log('🎵 Supported audio formats:');
  console.log('  MP3:', audio.canPlayType('audio/mpeg'));
  console.log('  Ogg (Vorbis):', audio.canPlayType('audio/ogg; codecs="vorbis"'));
  console.log('  Ogg (Opus):', audio.canPlayType('audio/ogg; codecs="opus"'));
  console.log('  WAV:', audio.canPlayType('audio/wav'));
  console.log('  AAC:', audio.canPlayType('audio/mp4; codecs="mp4a.40.2"'));







    return () => {
      // Only revoke blob: URLs, not media: URLs
    if (mediaUrl && mediaUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mediaUrl);
    } 
  };
}, [fileRef]);





  console.log('Rendering MediaThumbnail:', { mediaUrl, fileType, fileName });


  if (!mediaUrl) {
    return <div>No mediaUrl. Loading media...</div>;
  }

if (mediaUrl) {

  // Video

//   return (
//   <div>
//     <h3>Testing Media Protocol</h3>
//     <audio controls src="media://fogg-1763059316681.ogg">
//       Your browser does not support audio.
//     </audio>
//     <hr />
//     {/* Your normal render */}
//   </div>
// );



// VIDEO
if (fileType?.startsWith('video/')) {
  return (
    <div className="media media-video">
// MediaThumbnail.jsx - Add temporarily
<div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
  <h3>🎬 Codec Test Suite</h3>
  
  <h4>WebM (VP9) - Should Work ✅</h4>
  <video controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.webm" type="video/webm" />
  </video>
  
  <h4>MP4 (H.264) - Might Not Work video/mp4 ❌</h4>
  <video controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
  </video>
  
  <h4>Ogg (Theora) - Should Work video/ogg ✅</h4>
  <video controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src="https://www.w3schools.com/html/movie.ogg" type="video/ogg" />
  </video>
  
  <h4>Local media:// protocol test</h4>
  <video controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src="media://20231017_165321-1763064053599.mp4" type="video/mp4" />
  </video>
</div>
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
          console.error('❌ Video element error');
          console.error('Event:', e);
          console.error('Target:', e.target);
          console.error('Error object:', e.target.error);
          console.error('Media URL:', mediaUrl);
          console.error('File type:', fileType);
          console.error('Network state:', e.target.networkState);
          console.error('Ready state:', e.target.readyState);
        }}
        onLoadStart={() => {
          console.log('🔄 Video load started');
        }}
        onLoadedMetadata={() => {
          console.log('✅ Video metadata loaded');
        }}
        onCanPlay={() => {
          console.log('✅ Video can play');
        }}
      >
        <source src={mediaUrl} type={fileType} />
        Your browser does not support the video tag.
      </video>
      <span className="image-subinfo">
        {fileName} ({(fileSize / 1024 / 1024).toFixed(2)} MB) {fileType}
      </span>
    </div>
  );
}

  // image 

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
            <p>PDF cannot be displayed. </p>
              <a href={mediaUrl} target="_blank" rel="noopener noreferrer">
              Open PDF</a>

           
          </object>

          
          <span className="image-subinfo">
            {fileName} ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );

       } 
       
       
      else if (fileType?.startsWith('audio/')) {
          return (
        <div className="media media-audio">
          
            <h3>🎵 Audio Test Suite</h3>
  
  <h4>MP3 - Should Work ✅</h4>
  <audio controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
  </audio>
  
  <h4>Ogg Vorbis - Should Work ✅</h4>
  <audio controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src="https://upload.wikimedia.org/wikipedia/commons/c/c8/Example.ogg" type="audio/ogg" />
  </audio>
  
  <h4>WAV - Should Work ✅</h4>
  <audio controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src="https://www.soundjay.com/button/sounds/button-09.wav" type="audio/wav" />
  </audio>
  
  <h4>Local media:// protocol test</h4>
  <audio controls style={{ width: '300px', display: 'block', margin: '10px 0' }}>
    <source src={mediaUrl} type={fileType} />
  </audio>
          <audio controls
          preload="metadata"
          style={{ width: '100%', maxWidth: maxWidth || '500px' }}>
            <source src={mediaUrl}  type={fileType}/>
            Your browser does not support the audio tag.
          </audio>
          <br></br>
          <span className="image-subinfo">   
            {fileName}  ({(fileSize / 1024).toFixed(2)} KB)
          </span>
        </div>
      );
    } 
      
    

      return (
        <div className="media">
          <p>Unsupported file type: {fileType}</p>
          <span className="image-subinfo">
            <Link to={mediaUrl}>
            {fileName} </Link> ({(fileSize / 1024).toFixed(2)} KB)
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