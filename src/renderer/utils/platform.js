export const isElectron = () => {
  // Check if we're in Electron environment
  return !!(window && window.process && window.process.type);
};

export const isBrowser = () => {
  // Check if we're running in browser mode (via environment variable)
  return process.env.TARGET_PLATFORM === 'browser' || !isElectron();
};

export const getPlatform = () => {
  return isElectron() && process.env.TARGET_PLATFORM !== 'browser' ? 'electron' : 'browser';
};

// Platform-specific configurations
export const platformConfig = {
  electron: {
    windowControls: true,
    fileSystem: true,
    nativeMenus: true,
    titleBar: false, // Electron handles title bar
  },
  browser: {
    windowControls: false,
    fileSystem: false, // Limited file system access
    nativeMenus: false,
    titleBar: true, // Show custom title bar
  }
};

export const getCurrentPlatformConfig = () => {
  return platformConfig[getPlatform()];
};
