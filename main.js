const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url  = require('url');
const fs   = require('fs');
const Store = require('electron-store');

const store = new Store();

let launcherWin   = null;
let itemWin       = null;
let mapWin        = null;
let timerWin      = null;
let broadcastWin  = null;
let broadcastBg   = 'black';
let timerBg       = 'black';

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
      // The map is often left visible while the user focuses on the game —
      // disable Chromium's background throttling so auto-tracker updates
      // keep painting at full speed even when this window isn't focused.
      backgroundThrottling: false,
    }
  });
  mapWin.setMenuBarVisibility(false);
  const q = `?zoom=${pct}&layout=${layout||'horizontal'}&enemizer=${enemizer||'yes'}&gtcrystals=${gtCrystals||7}&wshost=${wsHost||'localhost'}&wsport=${wsPort||23074}&gamemode=${gamemode||'standard'}&dungeonitems=${dungeonItems||'standard'}&swordless=${swordless||'no'}`;
  mapWin.loadURL(toFileUrl('map.html') + q);
  mapWin.on('closed', () => { mapWin = null; });
}

// ── Timer window ──────────────────────────────────────────────────────────────
function createTimerWindow(wsHost, wsPort, color, bg, bounds) {
  const isTransparent = bg === 'transparent';
  const bgColors = { black: '#000000', white: '#ffffff', grey: '#2a2a2a', transparent: '#00000000' };
  const opts = {
    width:  (bounds && bounds.width)  || 300,
    height: (bounds && bounds.height) || 220,
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
      // Critical: the timer's centisecond setInterval is clamped by Chromium
      // to ~1s when backgrounded. Without this the timer drifts massively
      // slow whenever the user focuses the game / OBS / another window.
      backgroundThrottling: false,
    }
  };
  if (bounds && bounds.x !== undefined && bounds.y !== undefined) {
    opts.x = bounds.x;
    opts.y = bounds.y;
  }
  timerWin = new BrowserWindow(opts);
  timerWin.setMenuBarVisibility(false);
  const q = `?wshost=${wsHost||'localhost'}&wsport=${wsPort||23074}&color=${color||'blue'}&bg=${bg||'black'}`;
  timerWin.loadURL(toFileUrl('timer.html') + q);
  timerWin.on('closed', () => { timerWin = null; });
  timerBg = bg || 'black';
}

function openTimer(wsHost, wsPort, color, bg) {
  if (timerWin && !timerWin.isDestroyed()) { timerWin.focus(); return; }
  createTimerWindow(wsHost, wsPort, color, bg);
}

// ── Broadcast window ──────────────────────────────────────────────────────────
function createBroadcastWindow(bg, bounds) {
  const root = getRoot();
  const isTransparent = bg === 'transparent';
  const bgColors = { black: '#000000', white: '#ffffff', grey: '#2a2a2a', transparent: '#00000000' };
  const opts = {
    width:  (bounds && bounds.width)  || 520,
    height: (bounds && bounds.height) || 245,
    resizable: true,
    useContentSize: true,
    title: 'ALTTP Broadcast View',
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
      preload: path.join(root, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      // Keep timers, BroadcastChannel callbacks, and paints running at full
      // speed even when the window is hidden behind OBS / the game window.
      // Without this, Chromium throttles backgrounded windows aggressively
      // and the broadcast view will stop updating until brought to focus.
      backgroundThrottling: false,
    },
  };
  if (bounds && bounds.x !== undefined && bounds.y !== undefined) {
    opts.x = bounds.x;
    opts.y = bounds.y;
  }
  broadcastWin = new BrowserWindow(opts);
  broadcastWin.setMenuBarVisibility(false);
  broadcastWin.loadFile(path.join(root, 'broadcast.html'), { query: { bg } });
  broadcastWin.on('closed', () => { broadcastWin = null; });
  broadcastBg = bg;
}

function openBroadcast(bg) {
  if (broadcastWin && !broadcastWin.isDestroyed()) { broadcastWin.focus(); return; }
  createBroadcastWindow(bg);
}

// ── IPC ───────────────────────────────────────────────────────────────────────
ipcMain.on('launch', (event, opts) => {
  store.set('settings', opts);
  if (opts.which === 'items' || opts.which === 'both') openItemTracker(opts.scale, opts.wsHost, opts.wsPort, opts.trackerBg, opts.dungeonItems);
  if (opts.which === 'map'   || opts.which === 'both') openMap(opts.zoom, opts.layout, opts.enemizer, opts.gtCrystals, opts.wsHost, opts.wsPort, opts.gamemode, opts.dungeonItems, opts.swordless);
  if (opts.which === 'timer') openTimer(opts.wsHost, opts.wsPort, opts.timerColor, opts.timerBg);
  if (opts.which === 'broadcast') openBroadcast(opts.trackerBg || 'black');
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

ipcMain.handle('set-broadcast-bg', (event, bg) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return;
  // Only the broadcast window participates in this handler.
  if (broadcastWin !== win) return;

  const wasTransparent  = broadcastBg === 'transparent';
  const willBeTransparent = bg === 'transparent';

  // Electron does not allow toggling the `transparent` flag after a window is
  // created. To switch in or out of transparent mode we need to recreate the
  // window, preserving its current bounds so the user does not lose position.
  if (wasTransparent !== willBeTransparent) {
    const bounds = win.getBounds();
    setImmediate(() => {
      if (broadcastWin === win) broadcastWin = null;
      if (!win.isDestroyed()) win.close();
      createBroadcastWindow(bg, bounds);
    });
    return;
  }

  // Same transparency mode — just swap the solid background color.
  const bgColors = { black: '#000000', white: '#ffffff', grey: '#2a2a2a', image: '#000000' };
  if (bgColors[bg]) win.setBackgroundColor(bgColors[bg]);
  broadcastBg = bg;
});

ipcMain.handle('set-timer-bg', (event, bg) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win || timerWin !== win) return;

  const wasTransparent  = timerBg === 'transparent';
  const willBeTransparent = bg === 'transparent';

  // Toggling transparency requires a window recreate (Electron limitation).
  if (wasTransparent !== willBeTransparent) {
    const bounds = win.getBounds();
    // Pull current ws/color from the window URL so the recreate matches.
    const currentUrl = new URL(win.webContents.getURL());
    const wsHost = currentUrl.searchParams.get('wshost') || 'localhost';
    const wsPort = currentUrl.searchParams.get('wsport') || '23074';
    const color  = currentUrl.searchParams.get('color')  || 'blue';
    setImmediate(() => {
      if (timerWin === win) timerWin = null;
      if (!win.isDestroyed()) win.close();
      createTimerWindow(wsHost, wsPort, color, bg, bounds);
    });
    return;
  }

  // Same transparency mode — just swap the solid background color.
  const bgColors = { black: '#000000', white: '#ffffff', grey: '#2a2a2a', custom: '#000000' };
  if (bgColors[bg]) win.setBackgroundColor(bgColors[bg]);
  timerBg = bg;
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
