// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
// import fs from 'fs';
// import path from 'path';

// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> PRELOADED');

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
  getAssetPath: (relativePath) => ipcRenderer.invoke('get-asset-path', relativePath),
  readAssetFile: (relativePath) => ipcRenderer.invoke('read-asset-file', relativePath),
  setupUserDatabase: () => ipcRenderer.invoke('setup-user-database'),
  saveAssetFile: (relativePath, content) => ipcRenderer.invoke('save-asset-file', relativePath, content),

});

// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> POSTLOADED');    fsdfsd


 export { electronHandler };
