const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  launch:       (opts) => ipcRenderer.send('launch', opts),
  loadSettings: ()     => ipcRenderer.invoke('load-settings'),
  getPaths:     ()     => ipcRenderer.invoke('get-paths'),
  setBroadcastBg: (bg) => ipcRenderer.invoke('set-broadcast-bg', bg),
  setTimerBg:     (bg) => ipcRenderer.invoke('set-timer-bg', bg),
  isElectron:   true,
});
