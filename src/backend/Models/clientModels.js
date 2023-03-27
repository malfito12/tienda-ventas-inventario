const clientControllers=require('../Controllers/clientControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain


ipcMain.handle('register-client',clientControllers.registerClient)
ipcMain.handle('get-all-clients',clientControllers.getAllClients)
ipcMain.handle('search-client-ci',clientControllers.searchClient)

module.exports=router


