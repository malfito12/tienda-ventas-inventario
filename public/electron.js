const { BrowserWindow, app } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
// require('../src/database/dbConnection')

require('../src/backend/Models/loginModels')
require('../src/backend/Models/sucursalModels')
require('../src/backend/Models/unidadMedidaModels')
require('../src/backend/Models/typeProductModels')
require('../src/backend/Models/productModels')
require('../src/backend/Models/userModels')
require('../src/backend/Models/clientModels')
// require('./models/sucursalsModel')

let win

function createWindow() {
  win = new BrowserWindow({
    // width: 1200,
    // height: 800,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      plugins: true,
      // preload: path.join(__dirname, 'preload.js')
    }
  })
  // win.removeMenu()
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



