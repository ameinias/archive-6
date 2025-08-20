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



class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}



let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
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

function saveWindowState(window: BrowserWindow) {
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

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Load previous window state
  const windowState = loadWindowState();

  console.log('>>>>>>>>>>>>>>>>>>'+ RESOURCES_PATH + '../../.erb/dll/preload.js')

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
        : path.join(__dirname, '../../.erb/dll/preload.js'), // ../../.erb/dll/preload.js
         
    },
  });

  console.log('Main window created with dimensions:', {
    width: windowState.width || 555,
    height: windowState.height || 555
  }, 'app is packed: ', app.isPackaged);

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
 
    console.log('>>>>>>>>>>>>>' + __dirname + '../../.erb/dll/preload.js ' + app.isPackaged);

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
  });

  mainWindow.on('close', () => {
    saveWindowState(mainWindow!);
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

console.log('>>> main.ts is running');
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
      console.log('>>> main.ts is running');
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
    
    return userDbPath;
  } catch (error) {
    console.error('Error setting up user database:', error);
    throw error;
  }
});



