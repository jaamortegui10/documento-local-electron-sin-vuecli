'use strict'
const PDFWindow = require('electron-pdf-window');

const { app, protocol, BrowserWindow, ipcMain } = require('electron');
/*const {
  createProtocol,
  installVueDevtools
} = require('vue-cli-plugin-electron-builder/lib')*/
const isDevelopment = process.env.NODE_ENV !== 'production'
const path = require('path');
const url = require('url');

const rutaInicial = '..';
var rutaActual = rutaInicial;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let winPdf;
let viewPdf;

// Scheme must be registered before the app is ready
//protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: false, standard: false } }])

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({ 
    width: 1000, 
    height: 8000,
    webPreferences:{
      nodeIntegration:true
    } 
  });

  //desactivar menú
  win.setMenu(null);
  console.log('index.html: ', path.join(__dirname, 'views/index.html'));
  /*
  win.loadURL(url.format({
    pathname:path.join(__dirname, 'views/index.html'),
    protocol:'file',
    slashes:true
  }));
  */

  win.loadFile(path.join(__dirname, 'views/index.html'));
  if(process.env.NODE_ENV !== 'production'){
    win.webContents.openDevTools();

  }
  /*
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    //createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  */
  win.on('closed', () => {
    win = null
  })
}

/*Intento renderizar el pdf en una ventana*/
function createWindowPdf(pdfUrl){
    let winPdf2 = new PDFWindow({
      width:700, 
      height:700
    })

    if(process.env.WEBPACK_DEV_SERVER_URL)
      wubPdf.loadURL(path.join(__dirname, '..', pdfUrl));
    else
      winPdf2.loadURL(path.join(__dirname,'../..', pdfUrl));

    winPdf2.on('closed', ()=>{
      winPdf2 = null;
    });
}



/*
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
*/
/*
app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  createWindow();
})

// Exit cleanly on request from parent process in development mode.
/*
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
*/

//***************************************
/*Eventos entre ventanas*/
//***************************************

/*
  Retorna la ruta inicial(la que tiene la app cuando inicia), y la 
  ruta actual(la última ruta que llegó)
*/
ipcMain.on('ruta:get', (event)=>{
  win.webContents.send('ruta:get', {rutaInicial,rutaActual});

});
/*
  Actualiza la ruta actual por la que llega por parámetro.
*/
ipcMain.on('ruta:post', (event, nuevaRuta) => {
  rutaActual = nuevaRuta;
});
/*
  Abre una nueva ventana con un pdf en su url.
*/
ipcMain.on('pdf:open', (event, rutaPdf) => {
  
  createWindowPdf(rutaPdf);
});
