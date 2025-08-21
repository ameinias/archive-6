


interface ElectronAPI {
  readAssetFile: (relativePath: string) => string;
  resizeToDefault: () => void;
  openExternal?: (url: string) => void; 
  getAssetPath: (relativePath: string) => Promise<string>;
  saveAssetFile: (relativePath: string, content: string) => Promise<string>; 
  setupUserDatabase: () => Promise<string>;
}


interface Window {
  electronAPI?: ElectronAPI;
}