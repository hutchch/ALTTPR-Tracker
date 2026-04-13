const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url  = require('url');
const fs   = require('fs');
const Store = require('electron-store');

const store = new Store();

let launcherWin = null;
let itemWin     = null;
let mapWin      = null;
let timerWin    = null;

// Find the directory that contains index.html, items/, map/ etc.
// With asar:false + extraResources copying to app/, this is always __dirname.
// We verify by checking items/ exists; if not, try resourcesPath/app.
function findAppRoot() {
  const candidates = [
    __dirname,
    path.join(process.resourcesPath, 'app'),
    path.join(process.resourcesPath),
  ];
  for (const dir of candidates) {
    if (fs.existsSync(path.join(dir, 'items'))) {
      console.log('App root found:', dir);
      return dir;
    }
  }
  console.warn('Could not find items/ folder. Falling back to __dirname:', __dirname);
  return __dirname;
}

let APP_ROOT = null;

function getRoot() {
  if (!APP_ROOT) APP_ROOT = findAppRoot();
  return APP_ROOT;
}

function toFileUrl(rel) {
  return url.pathToFileURL(path.join(getRoot(), rel)).href;
}

// ── Launcher ──────────────────────────────────────────────────────────────────
function createLauncher() {
  launcherWin = new BrowserWindow({
    width: 580, height: 990,
    minWidth: 580, minHeight: 700,
    resizable: false,
    useContentSize: true,
    title: 'Hutch-ALTTPR Tracker',
    backgroundColor: '#0d0d0d',
    webPreferences: {
      preload: path.join(getRoot(), 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    }
  });
  launcherWin.setMenuBarVisibility(false);
  launcherWin.loadURL(toFileUrl('index.html'));
  launcherWin.on('closed', () => {
    launcherWin = null;
    if (itemWin && !itemWin.isDestroyed()) itemWin.close();
    if (mapWin  && !mapWin.isDestroyed())  mapWin.close();
  });
}

// ── Item Tracker ──────────────────────────────────────────────────────────────
function openItemTracker(scale, wsHost, wsPort, bg, dungeonItems) {
  if (itemWin && !itemWin.isDestroyed()) { itemWin.focus(); return; }
  const s = parseFloat(scale) || 1.0;
  const isTransparent = bg === 'transparent';
  const bgColors = { black: '#000000', white: '#ffffff', grey: '#2a2a2a', transparent: '#00000000' };
  itemWin = new BrowserWindow({
    width: Math.ceil(500 * s), height: Math.ceil(620 * s),
    resizable: true,
    useContentSize: true,
    title: 'Item Tracker',
    backgroundColor: isTransparent ? undefined : (bgColors[bg] || '#000000'),
    transparent: isTransparent,
    titleBarStyle: isTransparent ? (process.platform === 'darwin' ? 'hiddenInset' : 'hidden') : 'default',
    titleBarOverlay: isTransparent && process.platform !== 'darwin' ? {
      color: '#00000000',
      symbolColor: '#ffffff',
      height: 30
    } : false,
    hasShadow: true,
    webPreferences: {
      preload: path.join(getRoot(), 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    }
  });
  itemWin.setMenuBarVisibility(false);
  const q = `?scale=${s}&wshost=${wsHost||'localhost'}&wsport=${wsPort||23074}&bg=${bg||'black'}&dungeonitems=${dungeonItems||'standard'}`;
  itemWin.loadURL(toFileUrl('itemtracker.html') + q);
  itemWin.on('closed', () => { itemWin = null; });
}

// ── Map ───────────────────────────────────────────────────────────────────────
function openMap(zoom, layout, enemizer, gtCrystals, wsHost, wsPort, gamemode, dungeonItems, swordless) {
  if (mapWin && !mapWin.isDestroyed()) { mapWin.focus(); return; }
  const pct = parseInt(zoom) || 100;
  const size = Math.round(512 * pct / 100);
  const isVert = layout === 'vertical';
  mapWin = new BrowserWindow({
    width:  isVert ? size + 60 : size * 2 + 80,
    height: isVert ? size * 2 + 360 : size + 360,
    resizable: true,
    useContentSize: true,
    title: 'Map',
    backgroundColor: '#0d0d0d',
    webPreferences: {
      preload: path.join(getRoot(), 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    }
  });
  mapWin.setMenuBarVisibility(false);
  const q = `?zoom=${pct}&layout=${layout||'horizontal'}&enemizer=${enemizer||'yes'}&gtcrystals=${gtCrystals||7}&wshost=${wsHost||'localhost'}&wsport=${wsPort||23074}&gamemode=${gamemode||'standard'}&dungeonitems=${dungeonItems||'standard'}&swordless=${swordless||'no'}`;
  mapWin.loadURL(toFileUrl('map.html') + q);
  mapWin.on('closed', () => { mapWin = null; });
}

// ── Timer window ──────────────────────────────────────────────────────────────
function openTimer(wsHost, wsPort, color, bg) {
  if (timerWin && !timerWin.isDestroyed()) { timerWin.focus(); return; }
  const isTransparent = bg === 'transparent';
  const bgColors = { black: '#000000', white: '#ffffff', grey: '#2a2a2a', transparent: '#00000000' };
  timerWin = new BrowserWindow({
    width: 300, height: 220,
    resizable: true,
    useContentSize: true,
    title: 'Timer',
    backgroundColor: isTransparent ? undefined : (bgColors[bg] || '#000000'),
    transparent: isTransparent,
    titleBarStyle: isTransparent ? (process.platform === 'darwin' ? 'hiddenInset' : 'hidden') : 'default',
    titleBarOverlay: isTransparent && process.platform !== 'darwin' ? {
      color: '#00000000',
      symbolColor: '#ffffff',
      height: 30
    } : false,
    hasShadow: true,
    webPreferences: {
      preload:          path.join(getRoot(), 'preload.js'),
      contextIsolation: true,
      nodeIntegration:  false,
      webSecurity:      false,
    }
  });
  timerWin.setMenuBarVisibility(false);
  const q = `?wshost=${wsHost||'localhost'}&wsport=${wsPort||23074}&color=${color||'blue'}&bg=${bg||'black'}`;
  timerWin.loadURL(toFileUrl('timer.html') + q);
  timerWin.on('closed', () => { timerWin = null; });
}

// ── IPC ───────────────────────────────────────────────────────────────────────
ipcMain.on('launch', (event, opts) => {
  store.set('settings', opts);
  if (opts.which === 'items' || opts.which === 'both') openItemTracker(opts.scale, opts.wsHost, opts.wsPort, opts.trackerBg, opts.dungeonItems);
  if (opts.which === 'map'   || opts.which === 'both') openMap(opts.zoom, opts.layout, opts.enemizer, opts.gtCrystals, opts.wsHost, opts.wsPort, opts.gamemode, opts.dungeonItems, opts.swordless);
  if (opts.which === 'timer') openTimer(opts.wsHost, opts.wsPort, opts.timerColor, opts.timerBg);
});

ipcMain.handle('load-settings', () => store.get('settings', {}));

ipcMain.handle('get-paths', () => {
  const root = getRoot();
  return {
    root,
    itemsUrl:    url.pathToFileURL(path.join(root, 'items')).href,
    mapUrl:      url.pathToFileURL(path.join(root, 'map')).href,
    itemsExists: fs.existsSync(path.join(root, 'items')),
  };
});

// ── Lifecycle ─────────────────────────────────────────────────────────────────
app.whenReady().then(() => {
  console.log('__dirname        :', __dirname);
  console.log('resourcesPath    :', process.resourcesPath);
  console.log('appRoot          :', getRoot());
  createLauncher();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createLauncher();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
