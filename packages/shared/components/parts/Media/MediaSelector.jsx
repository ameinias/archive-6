import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { db } from '@utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { MediaThumbnail } from '@components/parts/Media/MediaThumbnail.jsx';

export function MediaSelector({ show, onHide, onSelect, allowMultiple = true }) {
  const [selectedIds, setSelectedIds] = useState([]);
  
  const allMedia = useLiveQuery(() => db.media.toArray());

  // Sort by upload date
  const sortedMedia = allMedia
    ? [...allMedia].sort((a, b) => {
        const dateA = a.uploadedAt ? new Date(a.uploadedAt).getTime() : 0;
        const dateB = b.uploadedAt ? new Date(b.uploadedAt).getTime() : 0;
        return dateB - dateA;
      })
    : [];

  const toggleSelect = (mediaId) => {
    if (allowMultiple) {
      setSelectedIds(prev => 
        prev.includes(mediaId)
          ? prev.filter(id => id !== mediaId)
          : [...prev, mediaId]
      );
    } else {
      setSelectedIds([mediaId]);
    }
  };

  const handleConfirm = () => {
    onSelect(selectedIds);
    setSelectedIds([]);
    onHide();
  };

  const handleCancel = () => {
    setSelectedIds([]);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleCancel} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Media from Gallery</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {!sortedMedia || sortedMedia.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No media files in gallery yet.</p>
            <p>Upload some files first!</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
              <strong>Selected: {selectedIds.length}</strong>
              {selectedIds.length > 0 && (
                <Button 
                  variant="link" 
                  size="sm"
                  onClick={() => setSelectedIds([])}
                  style={{ marginLeft: '10px' }}
                >
                  Clear Selection
                </Button>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {sortedMedia.map((media) => {
                const isSelected = selectedIds.includes(media.id);
                
                return (
                  <div
                    key={media.id}
                    onClick={() => toggleSelect(media.id)}
                    style={{
                      border: isSelected ? '3px solid #007bff' : '2px solid #ddd',
                      borderRadius: '8px',
                      padding: '10px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#e7f3ff' : '#fff',
                      transition: 'all 0.2s',
                      position: 'relative'
                    }}
                  >
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '5px',
                        right: '5px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        zIndex: 10
                      }}>
                        ✓
                      </div>
                    )}

                    <MediaThumbnail 
                      fileRef={media.id}
                      maxWidth={'100%'}
                    />

                    <div style={{ 
                      marginTop: '8px', 
                      fontSize: '12px',
                      wordBreak: 'break-word'
                    }}>
                      <strong>{media.name}</strong><br />
                      <span style={{ color: '#666' }}>
                        {(media.size / 1024).toFixed(2)} KB
                      </span><br />
                      <span style={{ color: '#999', fontSize: '11px' }}>
                        {media.uploadedAt ? new Date(media.uploadedAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          disabled={selectedIds.length === 0}
        >
          Select {selectedIds.length > 0 ? `(${selectedIds.length})` : ''}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}