'use strict';

const bytenode = require('../../');
const fs = require('fs');
const v8 = require('v8');
const electron = require('electron');
const { app, BrowserWindow } = require('electron');

v8.setFlagsFromString('--no-lazy');

//if (!fs.existsSync('./funny-crypt.jsc')) {
  bytenode.compileFile('./funny-crypt.src.js', './funny-crypt.jsc');
//}

const funnyCrypt = require('./funny-crypt.jsc');

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow(
    {
      width: 800,
      height: 600,
      icon: __dirname + "buildResources/icons/icon-512x512.png",
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        nodeIntegrationInWorker: true
      }
    }
  );

  mainWindow.loadFile('index.html');
  mainWindow.removeMenu();
  setInterval(function () {
    let randomString =  Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let encrypedString = funnyCrypt(randomString);
    let decrypedString = funnyCrypt(encrypedString);
    mainWindow.webContents.send('set-html',
      `ORIGINAL RANDOM STRING ... : ${randomString}\n\n`+
      `ENCRYPTED STRING ......... : ${encrypedString}\n\n`+
      `DECRYPTED STRING ......... : ${decrypedString}\n\n`
    );
  }, 100);

  mainWindow.on('close', _ => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', _ => {

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', _ => {

  if (mainWindow === null) {
    createWindow();
  }
});

exports.app = app;
exports.mainWindow = mainWindow;
