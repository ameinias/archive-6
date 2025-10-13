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
import { app, BrowserWindow, shell, ipcRenderer, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import fs from 'fs';

let config;
const appVersion = process.env.APP_VERSION || 'newapp'; // Default to newapp

const {dialog} = require('electron');

// try {
//   config = require(`../../config/${appVersion}.json`);
// } catch (error) {
//   console.error(`Error loading config for ${appVersion}:`, error);
//   app.quit();
// }

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}



let mainWindow = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

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
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Load previous window state
  const windowState = loadWindowState();

  // console.log('>>>>>>>>>>>>>>>>>>'+ RESOURCES_PATH + '../../../.erb/dll/preload.js')

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
        : path.join(__dirname, '../../../.erb/dll/preload.js'), // ../../.erb/dll/preload.js

    },
  });

  console.log('Main window created with dimensions:', {
    width: windowState.width || 555,
    height: windowState.height || 555
  }, 'app is packed: ', app.isPackaged);

  mainWindow.loadURL(resolveHtmlPath('index.html')); // old line
 // mainWindow.loadURL(resolveHtmlPath(path.join(__dirname, `${appVersion}/index.html`)));

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

console.log('>>> main.js is running');
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

    // Create directories if they don't exist
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the file


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

// Save file to app directory
ipcMain.handle('save-artifact-file', async (event, relativePath, data) => {
  return new Promise((resolve, reject) => {
    const appDataPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app')
      : path.join(__dirname, '..','..');

    const fullPath = path.join(appDataPath, relativePath);

    console.log('main js aves-artifact-file - Saving file to:', fullPath);

    // Ensure directory exists
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });


    fs.writeFile(fullPath, Buffer.from(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(relativePath);
      }
    });
  });
});

// Get file URL for display
ipcMain.handle('get-artifact-url', async (event, relativePath) => {
  try {
    const appDataPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app')
      : path.join(__dirname, '..');

    const fullPath = path.join(appDataPath, relativePath);

    // Check if file exists
    await fs.access(fullPath);

    // Return file:// URL (normalize path separators)
    return `file://${fullPath.replace(/\\/g, '/')}`;
  } catch (error) {
    console.error('Error getting artifact URL:', error);
    return null;
  }
});


