/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcRenderer, ipcMain, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';


console.log('>>> main.js is running - top');
let config;
const appVersion = process.env.APP_VERSION || 'newapp'; // Default to newapp

const {dialog} = require('electron'); // stop trying to change this!!!! 


class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let RESOURCES_PATH;



let mainWindow = null;


ipcMain.handle('show-alert', async (event, str) => {
  const options = {
    type: 'none',
    buttons: ["Ok"],
    defaultId: 0,
    cancelId: 0,
    detail: str,
    message: '',

  };
  return dialog.showMessageBoxSync(null, options);
});

ipcMain.handle('show-confirm', async (event, str) => {
  const options = {
    type: 'question',
    buttons: ["Cancel", "Ok"],
    defaultId: 1,
    cancelId: 0,
    detail: str,
    message: ''
  };
  return dialog.showMessageBoxSync(null, options);
});



ipcMain.handle('get-media-data', async (event, relativePath) => {
  try {
    const fileName = relativePath.replace('media/', '');
    const filePath = path.join(RESOURCES_PATH, 'media', fileName);
    

    
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    
    // Read file as base64
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    
    // Get MIME type
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.mov': 'video/mp4',
      '.ogg': 'audio/ogg',
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.m4a': 'audio/mp4',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif'
    };
    const mimeType = mimeTypes[ext] || 'application/octet-stream';
    

    
    return {
      data: base64,
      mimeType: mimeType
    };
    
  } catch (error) {
    console.error(' Error loading media:', error);
    throw error;
  }
});


ipcMain.on('resize-to-default', () => {
  if (mainWindow) {
    mainWindow.setSize(555, 555); // Set your default width and height
    mainWindow.center();
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const WINDOW_STATE_PATH = path.join(app.getPath('userData'), 'window-state.json');

function loadWindowState() {
  try {
    const data = fs.readFileSync(WINDOW_STATE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    // Default window state
    return { width: 555, height: 555 };
  }
}

function saveWindowState(window) {
  if (!window) return;
  const bounds = window.getBounds();
  fs.writeFileSync(WINDOW_STATE_PATH, JSON.stringify(bounds));
}


const createWindow = async () => {
  if (isDebug) {
    await installExtensions();


  if (typeof window !== 'undefined') {
     window.React = React;
}
  }



  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Load previous window state
  const windowState = loadWindowState();


   const preloadPath ='../../.erb/dll/preload.js';


  console.log('>>>>>>>>>>>>>>>>>>'+ RESOURCES_PATH + preloadPath)

  mainWindow = new BrowserWindow({
    show: false,
    width: windowState.width || 655,
    height: windowState.height || 555,
    x: windowState.x,
    y: windowState.y,
    icon: getAssetPath('icons/folder.png'),
    webPreferences: {
      contextIsolation: true,
        nodeIntegration: false,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, preloadPath), // ../../.erb/dll/preload.js
    sandbox: false,  
    webSecurity: true,
    allowRunningInsecureContent: false,
    allowFileAccessFromFileURLs: true,
    allowUniversalAccessFromFileURLs: true,
    // experimentalFeatures: true,  
    enableRemoteModule: false
    },
  });
  console.log('main - dirname  -----------' +__dirname);

  console.log('Main window created with dimensions:', {
    width: windowState.width || 555,
    height: windowState.height || 555
  }, 'app is packed: ', app.isPackaged);

  mainWindow.loadURL(resolveHtmlPath('index.html')); // old line
 // mainWindow.loadURL(resolveHtmlPath(path.join(__dirname, `${appVersion}/index.html`)));

 console.log('---- MAIN - dirname  -----------' +__dirname);

mainWindow.webContents.on('will-prevent-unload', (e) => {
  // code for showMessageBoxSync, prevent default if the user wants to close
  if (process.platform === 'win32') {
    mainWindow.hide();
    setTimeout(() => mainWindow.show());
  }
});



  mainWindow.on('ready-to-show', () => {

    console.log('>>>>>>>>>>>>>' + __dirname + '../../../.erb/dll/preload.js ' + app.isPackaged);

    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
      if (BrowserWindow.getAllWindows().length === 0) {
    app.quit();
  }
  });

  mainWindow.on('close', () => {
    saveWindowState(mainWindow);
  });


  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {


          shell.openExternal(edata.url);
      return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

console.log('>>> main.js is running  - after createWindow');
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {

    
       RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');


//  console.log('RESOURCES_PATH:', RESOURCES_PATH);
  
    // Register safe local file protocol
    protocol.registerFileProtocol('safe-file', (request, callback) => {
      try {
        // Remove 'safe-file:///' prefix
        let filePath = request.url.replace('safe-file:///', '');
        
        // Decode URL encoding
        filePath = decodeURIComponent(filePath);
        
        console.log('📹 Safe-file protocol serving:', filePath);
        
        if (!fs.existsSync(filePath)) {
          console.error('❌ File not found:', filePath);
          callback({ error: -6 }); // FILE_NOT_FOUND
          return;
        }
        
        callback({ path: filePath });
      } catch (error) {
        console.error('❌ Protocol handler error:', error);
        callback({ error: -2 }); // FAILED
      }
    });
    

    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
      console.log('>>> main.js is running');
    });
  })
  .catch(console.log);

// Replace your existing handlers with these:
ipcMain.handle('get-asset-path', (event, relativePath) => {


  const APP_DATA_PATH = path.join(app.getPath('userData'), 'assets');

  // Create the directory if it doesn't exist
  if (!fs.existsSync(APP_DATA_PATH)) {
    fs.mkdirSync(APP_DATA_PATH, { recursive: true });
  }

  return path.join(APP_DATA_PATH, relativePath);
});

ipcMain.handle('read-asset-file', async (event, relativePath) => {
  try {
// use appdata or resources
    const APP_DATA_PATH = path.join(app.getPath('userData'), 'assets');
    const appDataFile = path.join(APP_DATA_PATH, relativePath.replace('assets/', ''));

    // If file exists in AppData, use it
    if (fs.existsSync(appDataFile)) {
      console.log('Reading from AppData:', appDataFile);
      return fs.readFileSync(appDataFile, 'utf8');
    }

    // Otherwise, fallback to bundled assets
    const bundledPath = app.isPackaged
      ? path.join(process.resourcesPath, relativePath)
      : path.join(__dirname, '../../', relativePath);

    console.log('Reading from bundled assets:', bundledPath);
    return fs.readFileSync(bundledPath, 'utf8');
  } catch (error) {
    console.error('Error reading asset file:', error);
    throw error;
  }
});


// Add IPC handler to clear all data
ipcMain.handle('clear-all-data', async () => {
  try {
    const session = mainWindow.webContents.session;
    
    // Clear all caches
    await session.clearCache();
    await session.clearStorageData();
    
    // Clear IndexedDB
    const userDataPath = app.getPath('userData');
    const fs = require('fs');
    const path = require('path');

    
    // // Delete media files
    // const mediaPath = path.join(userDataPath, 'assets', 'media');
    // if (fs.existsSync(mediaPath)) {
    //   fs.rmSync(mediaPath, { recursive: true, force: true });
    // }
    
    // Delete database
    const dbPath = path.join(userDataPath, 'IndexedDB');
    if (fs.existsSync(dbPath)) {
      fs.rmSync(dbPath, { recursive: true, force: true });
    }
    
    
    console.log('✅ All data cleared');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    return { success: false, error: error.message };
  }
});


// copy bundled database to AppData on first run
ipcMain.handle('setup-user-database', async () => {
  try {
    const APP_DATA_PATH = path.join(app.getPath('userData'), 'assets', 'databases');
    const userDbPath = path.join(APP_DATA_PATH, 'dexie-import.json');

    // If user database doesn't exist, copy from bundled assets
    if (!fs.existsSync(userDbPath)) {
      // Create directories
      fs.mkdirSync(APP_DATA_PATH, { recursive: true });

      // Copy from bundled assets
      const bundledDbPath = app.isPackaged
        ? path.join(process.resourcesPath, 'assets/databases/dexie-import.json')
        : path.join(__dirname, '../../assets/databases/dexie-import.json');

      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, userDbPath);
        console.log('Copied database to user folder:', userDbPath);
      }
    }

    console.log('User database setup at:', userDbPath);
    return userDbPath;
  } catch (error) {
    console.error('Error setting up user database:', error);
    throw error;
  }
});



// copy bundled database to AppData on first run
ipcMain.handle('read-bundled-file', async (event,  fileName) => {
  try {
    // Read from resources/assets/databases folder
    const filePath = path.join(RESOURCES_PATH, 'databases', fileName);
    
    console.log('📁 Reading bundled file:', filePath);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Bundled file not found: ${filePath}`);
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    
    console.log('✅ Read bundled file, size:', fileContents.length);
    
    return { 
      success: true, 
      data: fileContents,
      name: fileName
    };
  } catch (error) {
    console.error('❌ Error reading bundled file:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
});


// copy bundled database to AppData on first run
ipcMain.handle('overwrite-database', async () => {
  try {
    const APP_DATA_PATH = path.join(app.getPath('userData'), 'assets', 'databases');
    const userDbPath = path.join(APP_DATA_PATH, 'dexie-import.json');

    // If user database doesn't exist, copy from bundled assets
    // this shouldn't need to be made since the database is always copied on first run
    if (!fs.existsSync(userDbPath)) {
      // Create directories
      fs.mkdirSync(APP_DATA_PATH, { recursive: true });

      // Copy from bundled assets
      const bundledDbPath = app.isPackaged
        ? path.join(process.resourcesPath, 'assets/databases/dexie-import.json')
        : path.join(__dirname, '../../assets/databases/dexie-import.json');

      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, userDbPath);
        console.log('Copied database to user folder:', userDbPath);
      }
    }

    return userDbPath;
  } catch (error) {
    console.error('Error setting up user database:', error);
    throw error;
  }
});


    // If there are build issues with saving default database, the problem is here in this fuction with projectExportPath
// export database as file
ipcMain.handle('save-asset-file', async (event, relativePath, content) => {
  try {
    const APP_DATA_PATH = path.join(app.getPath('userData'), 'assets');
    const fullPath = path.join(APP_DATA_PATH, relativePath.replace('assets/', ''));

    const projectRoot = app.isPackaged
  ? path.dirname(process.execPath)  // When packaged, use exe location
  : path.join(__dirname, '../..');  // In dev, go up from compiled main.js

  // diff 

    // Create directories if they don't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file SAVE ASSET (WORKS)


    const projectExportPath = path.join(projectRoot, 'assets/databases/', 'dexie-import.json');

    const exportDir = path.dirname(projectExportPath);
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

    fs.writeFileSync(projectExportPath, content, 'utf8');
    console.log('Saved asset file to:', projectExportPath);

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Saved asset file to:', fullPath);

    return fullPath;
  } catch (error) {
    console.error('Error saving asset file:', error);
    throw error;
  }
});

// Get the app's data directory (works in both dev and packaged)
const getAppDataPath = () => {
  return app.isPackaged
    ? path.join(process.resourcesPath, 'app')
    : __dirname;
};

// Save file to app directory - this saves to Appdata!! 
ipcMain.handle('save-artifact-file', async (event, relativePath, arrayBuffer) => {
  try {
console.log('save artifact hit');
    const APP_DATA_PATH = path.join(app.getPath('userData'), 'assets');
    const fullPath = path.join(APP_DATA_PATH, relativePath.replace('assets/', ''));


        const projectRoot = app.isPackaged
  ? path.dirname(process.execPath)  // When packaged, use exe location
  : path.join(__dirname, '../..');  // In dev, go up from compiled main.js
  

    
    // Create directories if they don't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file  SAVE ARTIFACT
    

    // fs.writeFileSync(fullPath, Buffer.from(arrayBuffer));
    
    

    const projectExportPath = path.join(projectRoot, 'assets/media/', 'file.png');

    const exportDir = path.dirname(projectExportPath);
if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, { recursive: true });
}

    fs.writeFileSync(projectExportPath, content, 'utf8');
    console.log('Saved media file to:', projectExportPath);

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('Saved media file to:', fullPath);


    
    return { success: true, path: fullPath };
  } catch (error) {
    console.error('Error saving artifact:', error);
    return { success: false, error: error.message };
  }
});




// Get file URL for display
ipcMain.handle('get-artifact-url', async (event, relativePath) => {
  try {
    const appDataPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app')
      : path.join(__dirname, '..');

    const fullPath = path.join(appDataPath, relativePath);


    const absolutePath = path.resolve(fullPath);

    // Check if file exists
    await fs.access(fullPath);

    console.log('Getting artifact URL for:', absolutePath);

    // Return file:// URL (normalize path separators)
    return `file://${absolutePath.replace(/\\/g, '/')}`;
  } catch (error) {
    console.error('Error getting artifact URL:', error);
    return null;
  }
});

// const { ipcMain } = require('electron');
// const fs = require('fs');
// const path = require('path');

ipcMain.handle('save-media-file', async (event, fileName, arrayBuffer) => {
  try {



    if (!RESOURCES_PATH) {
      throw new Error('RESOURCES_PATH is not initialized');
    }

    //  Save to project assets/media folder (shared with all users)
    // return; // temp

    const mediaDir = path.join(RESOURCES_PATH, 'media');
    
    
    // Create directory if it doesn't exist
    fs.mkdirSync(mediaDir, { recursive: true });
    
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const ext = path.extname(fileName);
    const baseName = path.basename(fileName, ext);
    const uniqueFileName = `${baseName}-${timestamp}${ext}`;
    
    const filePath = path.join(mediaDir, uniqueFileName);
    
    // Write file
    fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    
    console.log('Main save-media: Media file saved to:', filePath);
    
    // Return relative path for database storage
    return { 
      success: true, 
      path: `media/${uniqueFileName}`,  // Relative to assets/
      fullPath: filePath 
    };
  } catch (error) {
    console.error('Error saving media file:', error);
    return { success: false, error: error.message };
  }
});

// Get full file:// URL for media files
ipcMain.handle('get-media-path', async (event, relativePath) => {
  try {
    if (!RESOURCES_PATH) {
      throw new Error('RESOURCES_PATH is not initialized');
    }

    const fileName = relativePath.replace('media/', '');
    const fullPath = path.join(RESOURCES_PATH, 'media', fileName);
    
    console.log('📁 Gettingdd  media path for:', fullPath);
    console.log('📁 File exists?', fs.existsSync(fullPath));
    
    if (!fs.existsSync(fullPath)) {
      throw new Error('File not found: ' + fullPath);
    }
    
    
    // ✅ Return safe-file:// URL instead of file://
    const normalizedPath = fullPath.replace(/\\/g, '/');
    const safeUrl = `safe-file:///${normalizedPath}`;
    
    console.log('✅ Returning safe URL:', safeUrl);
    
    return safeUrl;
  } catch (error) {
    console.error('❌ Error getting media path:', error);
    return null;
  }
});

// Delete media file
ipcMain.handle('delete-media-file', async (event, relativePath) => {
  try {
    const fullPath = path.join(RESOURCES_PATH, relativePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  } catch (error) {
    console.error('Error deleting media file:', error);
    return { success: false, error: error.message };
  }
});

// Add this temporarily to main.js after all handlers
console.log('Registered IPC handlers:', ipcMain.eventNames());

// main.js
// const { ipcMain, app } = require('electron');
// const fs = require('fs');
// const path = require('path');



ipcMain.handle('get-resources-path', async () => {
  if (!RESOURCES_PATH) {
    throw new Error('RESOURCES_PATH is not initialized');
  }
  console.log('📁 Returning RESOURCES_PATH:', RESOURCES_PATH);
  return RESOURCES_PATH;
});



