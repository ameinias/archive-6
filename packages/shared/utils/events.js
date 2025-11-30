// utils/events.js

// This intervenes in a lot of electron calls, and chooses what to do if it's not electron. Right now it's mostly just throwing null. 


class EventManager {
  constructor() {
    this.isElectron = typeof window !== 'undefined' && window.electronAPI;
    
  }

  on(eventName, callback) {
    if (this.isElectron) {
      window.electronAPI.on(eventName, callback);
    } else {
      // Use custom events for web
      window.addEventListener(eventName, callback);
    }
  }

  removeListener(eventName, callback) {
    if (this.isElectron) {
      window.electronAPI.removeListener(eventName, callback);
    } else {
      window.removeEventListener(eventName, callback);
    }
  }

  emit(eventName, data) {
    if (this.isElectron) {
      // Electron would handle this on the main process
      console.log('Electron emit:', eventName, data);
    } else {
      // Dispatch custom event for web
      window.dispatchEvent(new CustomEvent(eventName, { detail: data }));
    }
  }

  showConfirm(message) {
    if (this.isElectron) {
      return window.electronAPI.showConfirm(message,"confirm");
    } else {
      return Promise.resolve(window.confirm(message));
    }
  }

  showAlert(message) {
    if (this.isElectron) {
      return window.electronAPI.showAlert(message);
    } else {
      return Promise.resolve(window.alert(message));
    }
  }

  setupUserDatabase() {
    if (this.isElectron) {
      return window.electronAPI.setupUserDatabase();
    } else {
      return null;
    }
  }

    updateVersionFile() {
    if (this.isElectron) {
      return window.electronAPI.updateVersionFile();
    } else {
      return null;
    }
  }

    checkVersionFile(curVersion) {
    if (this.isElectron) {
      return window.electronAPI.checkVersionFile(curVersion);
    } else {
      return null;
    }
  }

  async readBundledFile(fileName = 'dexie-import.json') {
    console.log('📁 readBundledFile called with:', fileName);
    
    if (this.isElectron && window.electronAPI?.readBundledFile) {
      try {
        const result = await window.electronAPI.readBundledFile(fileName);
        console.log('✅ readBundledFile result:', result);
        
        if (result.success) {
          return result.data;
        } else {
          throw new Error(result.error || 'Failed to read bundle file');
        }
      } catch (error) {
        console.error('❌ Error in readBundledFile:', error);
        throw error;
      }
    } else {
      // Web fallback - fetch from public folder
      const response = await fetch(`/databases/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}`);
      }
      return await response.text();
    }
  }


  readAssetFile(path) {
    if (this.isElectron) {
      return window.electronAPI.readAssetFile(path);
    } else {
      return null;
    }
  }

  saveAssetFile(path, content) {
    if (this.isElectron) {
      return window.electronAPI.saveAssetFile(path, content);
    } else {
      return null;
    }
  }

  getAssetPath(path) {
    if (this.isElectron) {
      return window.electronAPI.getAssetPath(path);
    } else {
      return window.getAssetPath(path);
    }
  }

    getMediaPath(path) {
    if (this.isElectron) {
      return window.electronAPI.getMediaPath(path);
    } else {
      return window.getMediaPath(path);
    }
  }

      getMediaData(path) {
    if (this.isElectron) {
      return window.electronAPI.getMediaData(path);
    } else {
      return `/${path}`;
    }
  }





}

export const eventManager = new EventManager();

  export const loadAsset = async (assetPath) => {
  // Ensure path doesn't start with slash
  const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
  
  // Ensure path starts with 'assets/'
  const fullPath = cleanPath.startsWith('assets/') ? cleanPath : `assets/${cleanPath}`;

  if (eventManager.isElectron) {
    try {
      const result = await window.electronAPI.getMediaData(fullPath);
      
      if (result.error) {
        console.error(`Failed to load asset: ${fullPath}`, result.error);
        // Fallback to public path
        return `/${fullPath}`;
      }
      
      // Return base64 data URL
      return `data:${result.mimeType};base64,${result.data}`;
    } catch (error) {
      console.error(`Error loading asset: ${fullPath}`, error);
      // Fallback to public path
      return `/${fullPath}`;
    }
  } else {
    // Web: Use public path
    return `/${fullPath}`;
  }
};

