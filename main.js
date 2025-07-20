const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');

  // Lukker appen når vinduet lukkes
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Denne metode vil blive kaldt når Electron er klar
app.whenReady().then(createWindow);

// Luk appen når alle vinduer er lukket
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});