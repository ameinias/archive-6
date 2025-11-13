// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
// import fs from 'fs';
// import path from 'path';

 console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> PRELOADED');

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel, ...args) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel, func) {
      const subscription = (_event, ...args) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel, func) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};




// const fs = require('fs');
// const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  // readAssetFile: (relativePath) =>
  //  ipcRenderer.invoke('read-asset-file', relativePath),
  resizeToDefault: () => ipcRenderer.send('resize-to-default'),
  getResourcesPath: () => 
    ipcRenderer.invoke('get-resources-path'),
  getAssetPath: (relativePath) => ipcRenderer.invoke('get-asset-path', relativePath),
  readAssetFile: (relativePath) => ipcRenderer.invoke('read-asset-file', relativePath),
  setupUserDatabase: () => ipcRenderer.invoke('setup-user-database'),
  // saves default database to app data
  saveAssetFile: (relativePath, content) => ipcRenderer.invoke('save-asset-file', relativePath, content), 
   
    showAlert: (message) => ipcRenderer.invoke('show-alert', message),
    showConfirm: (message) => ipcRenderer.invoke('show-confirm', message),

    //all this mess to try media files
     saveArtifactFile: (relativePath, data) => ipcRenderer.invoke('save-artifact-file', relativePath, data),
    getArtifactUrl: (relativePath) => ipcRenderer.invoke('get-artifact-url', relativePath),


    saveMediaFile: (fileName, arrayBuffer) =>
    ipcRenderer.invoke('save-media-file', fileName, arrayBuffer),

    
  getMediaPath: (relativePath) => 
    ipcRenderer.invoke('get-media-path', relativePath),
  deleteMediaFile: (relativePath) => 
    ipcRenderer.invoke('delete-media-file', relativePath),

    // Add IPC listener methods
    on: (channel, func) => {
      const subscription = (_event, ...args) => func(...args);
      ipcRenderer.on(channel, subscription);
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    removeListener: (channel, func) => {
      ipcRenderer.removeListener(channel, func);
    }

});




// Add this to your preload.js file
window.addEventListener('DOMContentLoaded', () => {
  // Prevent middle-click on links
  document.addEventListener('mousedown', (event) => {
    if (event.button === 1 && event.target.closest('a')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);

  // Also prevent the auxclick event which handles middle-clicks
  document.addEventListener('auxclick', (event) => {
    if (event.button === 1 && event.target.closest('a')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
console.log('>>> preload.js is running - end');

});





 export { electronHandler };
