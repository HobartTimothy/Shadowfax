const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('shadowfax', {
  saveImage(buffer, defaultName) {
    return ipcRenderer.invoke('save-image', { buffer, defaultName });
  },
});
