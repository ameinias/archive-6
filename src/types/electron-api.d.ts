interface ElectronAPI {
  readAssetFile: (relativePath: string) => string;
  resizeToDefault: () => void;
  openExternal?: (url: string) => void; // If you add this in preload
  // Add more as you expose them
}

interface Window {
  electronAPI?: ElectronAPI;
}