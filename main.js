const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 455,
    frame: false,
    resizable: false,
    webPreferences: { nodeIntegration: true },
    icon: "images/icon.png"
  });

  mainWindow.loadFile('www/index.html');
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', app.quit)

try { require('electron-reloader')(module) } catch (_) { };