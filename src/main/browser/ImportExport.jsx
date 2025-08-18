import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { db } from '../utils/db';
import { isElectron, isBrowser } from '../../renderer/utils/platform';

export function ImportExport() {
  const [status, setStatus] = useState('');

  const handleExport = async () => {
    if (!db.export) {
      setStatus('Export function not available');
      return;
    }

    try {
      const blob = await db.export();

      if (isElectron()) {
        // Electron-specific file handling
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "dexie-export.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Browser-specific file handling
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "dexie-export-browser.json";
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setStatus('Database exported successfully!');
    } catch (error) {
      setStatus(`Export failed: ${error.message}`);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleImport(file);
    }
  };

  const handleImport = async (file) => {
    try {
      setStatus('Importing database...');

      await db.close();
      await db.delete();
      await db.open();

      await db.import(file, {
        progressCallback: (progress) => {
          setStatus(`Import progress: ${Math.round(progress.completedRows / progress.totalRows * 100)}%`);
        }
      });

      setStatus('Database imported successfully!');
    } catch (error) {
      setStatus(`Import error: ${error.message}`);
      try {
        await db.open();
      } catch (reopenError) {
        setStatus(`Import failed and couldn't reopen database: ${reopenError.message}`);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImport(files[0]);
    }
  };

  return (
    <div className="import-export-container">
      <h2>Database Import/Export</h2>



      WHAT IS THIS?!
      WHAT IS THIS?!
      WHAT IS THIS?!
      WHAT IS THIS?!
      WHAT IS THIS?!
      WHAT IS THIS?!
      WHAT IS THIS?!
      WHAT IS THIS?!
      WHAT IS THIS?!

      {isBrowser() && (
        <div className="alert alert-info">
          <strong>Browser Mode:</strong> File operations have limited functionality compared to desktop version.
        </div>
      )}

      <div className="export-section">
        <h3>Export Database</h3>
        <Button variant="primary" onClick={handleExport}>
          Export Database
        </Button>
      </div>

      <div className="import-section">
        <h3>Import Database</h3>

        {/* File input - works in both platforms */}
        <div className="file-input-section">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            style={{ marginBottom: '10px' }}
          />
          <br />
          <small>Select a JSON export file to import</small>
        </div>

        {/* Drag & Drop - enhanced for browser */}
        <div
          className={`dropzone ${isBrowser() ? 'browser-dropzone' : 'electron-dropzone'}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <p>
            {isElectron()
              ? 'Drag and drop a JSON file here to import'
              : 'Drag and drop a JSON file here (browser mode)'
            }
          </p>
        </div>
      </div>

      {status && (
        <div className={`status-message ${status.includes('error') || status.includes('failed') ? 'error' : 'success'}`}>
          {status}
        </div>
      )}
    </div>
  );
}
