import { getFileType } from '@hooks/dbHooks';
import { Link } from 'react-router-dom';

export function MediaDisplay({ file, index }) {
  const isFile = file instanceof File;
  const fileType = getFileType(file.name || '');

  return (
    <div key={index}>
      <div width="80%">
        {/* <Link to={`/file-fullscreen/entry-${index}`}> */}
          {isFile && fileType === 'image' ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
              }}
              onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))} // Cleanup
            />
          ) : isFile && fileType === 'video' ? (
            <video
              controls
              style={{
                width: '100%',
                maxWidth: '500px',
                height: 'auto',
              }}
            >
              <source src={URL.createObjectURL(file)} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="file-placeholder">
               {file.name || 'file' } {file.URL}
            </div>
          )}
        {/* </Link> */}

      </div>
    </div>
  );
}
