// utils/events.js
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

  readAssetFile(path) {
    if (this.isElectron) {
      return window.electronAPI.readAssetFile(path);
    } else {
      return null;
    }
  }

  saveAssetFile(path, content) {
    if (this.isElectron) {
      return window.electronAPI.readAssetFile(path, content);
    } else {
      return null;
    }
  }

  getAssetPath(path) {
    if (this.isElectron) {
      return window.electronAPI.getAssetPath(path);
    } else {
      return windiow.getAssetPath(path);
    }
  }











}

export const eventManager = new EventManager();
