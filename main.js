const { app, BrowserWindow, ipcMain, dialog, session } = require('electron');
const path = require('path');
const fs = require('fs').promises;

/** 禁止 Renderer 发起远程 HTTP(S)/WS/FTP（本地 file/blob/data 不受影响） */
function attachNetworkGuards(ses) {
  const remoteScheme = /^(https?|wss?|ftp):\/\//i;
  ses.webRequest.onBeforeRequest((details, callback) => {
    if (remoteScheme.test(details.url)) {
      callback({ cancel: true });
      return;
    }
    callback({});
  });

  ses.setPermissionRequestHandler((_contents, _permission, callback) => {
    callback(false);
  });
}

/** 降低 Chromium 后台网络探测（与 webRequest 叠加使用） */
function applyOfflineCommandLineSwitches() {
  app.commandLine.appendSwitch('disable-background-networking');
  app.commandLine.appendSwitch('disable-component-update');
}

applyOfflineCommandLineSwitches();

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
    title: 'Shadowfax · 证件打码',
    backgroundColor: '#f4f5f7',
  });

  win.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  win.webContents.on('will-navigate', (event, url) => {
    if (/^(https?|wss?|ftp):\/\//i.test(url)) {
      event.preventDefault();
    }
  });

  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
}

app.whenReady().then(() => {
  attachNetworkGuards(session.defaultSession);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('save-image', async (_evt, { buffer, defaultName }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    title: '导出图片',
    defaultPath: defaultName || 'masked.png',
    filters: [
      { name: 'PNG', extensions: ['png'] },
      { name: 'JPEG', extensions: ['jpg', 'jpeg'] },
    ],
  });
  if (canceled || !filePath) return { ok: false };
  await fs.writeFile(filePath, Buffer.from(buffer));
  return { ok: true, filePath };
});
