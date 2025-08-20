// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// import fs from 'fs';
// import path from 'path';

export type Channels = 'ipc-example';

// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> PRELOADED');

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};




// const fs = require('fs');
// const path = require('path');

contextBridge.exposeInMainWorld('electronAPI', {
  //readAssetFile: (relativePath: string) =>
  //  ipcRenderer.invoke('read-asset-file', relativePath),
  resizeToDefault: () => ipcRenderer.send('resize-to-default'),
  getAssetPath: (relativePath: string) => ipcRenderer.invoke('get-asset-path', relativePath),
  readAssetFile: (relativePath: string) => ipcRenderer.invoke('read-asset-file', relativePath),
  setupUserDatabase: () => ipcRenderer.invoke('setup-user-database'), 
});

// console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> POSTLOADED');    fsdfsd


export type ElectronHandler = typeof electronHandler;
