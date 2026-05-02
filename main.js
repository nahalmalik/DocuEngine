const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800
  });

  // Load via XAMPP (recommended for your system)
  win.loadURL('http://localhost/quotation-system/public/');
}

app.whenReady().then(createWindow);