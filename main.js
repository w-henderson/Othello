const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 455,
    frame: false,
    resizable: false
  });

  mainWindow.loadFile('www/index.html');
}

app.whenReady().then(() => {
  createWindow();
})

app.on('window-all-closed', app.quit)

require('electron-reloader')(module);