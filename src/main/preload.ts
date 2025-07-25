// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
// import fs from 'fs';
// import path from 'path';

export type Channels = 'ipc-example';

console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> PRELOADED');

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
  readAssetFile: (relativePath: string) =>
    ipcRenderer.invoke('read-asset-file', relativePath),
  resizeToDefault: () => ipcRenderer.send('resize-to-default')
});

console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>> POSTLOADED');


export type ElectronHandler = typeof electronHandler;
