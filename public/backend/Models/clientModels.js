const clientControllers=require('../Controllers/clientControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain


ipcMain.handle('register-client',clientControllers.registerClient)
ipcMain.handle('get-all-clients',clientControllers.getAllClients)
ipcMain.handle('search-client-ci',clientControllers.searchClient)
ipcMain.handle('update-client',clientControllers.updateClient)
ipcMain.handle('delete-client',clientControllers.deleteClient)

//--------------RECIBO------------------

ipcMain.handle('imprimir-recibo',clientControllers.imprimirRecibo)

module.exports=router


