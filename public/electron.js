const { BrowserWindow, app } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
// require('../src/database/dbConnection')

require('./backend/Models/loginModels')
require('./backend/Models/sucursalModels')
require('./backend/Models/unidadMedidaModels')
require('./backend/Models/typeProductModels')
require('./backend/Models/productModels')
require('./backend/Models/userModels')
require('./backend/Models/clientModels')
// require('./models/sucursalsModel')

let win

function createWindow() {
  win = new BrowserWindow({
    // width: 1200,
    // height: 800,
    icon:path.join(__dirname, "../assets/icons/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      plugins: true,
      // preload: path.join(__dirname, 'preload.js')
    }
  })
  win.removeMenu()
  win.maximize()
  win.show()

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  )
}


app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


//---------------CONNECTION LOWDB----------------------------



