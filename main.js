const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  // Load via XAMPP (recommended for your system)
  win.loadURL('http://docu.bizhubpakistan.com/public');
}

app.whenReady().then(createWindow);