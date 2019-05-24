const electron = require('electron');
const {
    app,
    BrowserWindow
} = electron;
const path = require('path');
const url = require('url');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            experimentalFeatures: true,
        }
    });
    mainWindow.setMenu(null);
    let startUrl;
    if(process.env.NODE_ENV !== 'production')
        startUrl = 'http://localhost:3000/login'
    else startUrl = url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    mainWindow.loadURL(startUrl);

    // mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}
var options = [
    //'enable-tcp-fastopen',
    //'enable-experimental-canvas-features',
    'enable-experimental-web-platform-features',
    //'enable-overlay-scrollbars',
    //'enable-hardware-overlays',
    //'enable-universal-accelerated-overflow-scroll',
    //'allow-file-access-from-files',
    //'allow-insecure-websocket-from-https-origin',
    ['js-flags', '--harmony_collections']
  ];
  
  for(var i=0; i < options.length; ++i) {
    if (typeof options[i] === 'string')
      app.commandLine.appendSwitch(options[i]);
    else
      app.commandLine.appendSwitch(options[i][0], options[i][1]);
  }
app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
});