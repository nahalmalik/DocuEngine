const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  // Load your live web app
  win.loadURL('https://bizhubpakistan.com/');
}

app.whenReady().then(createWindow);