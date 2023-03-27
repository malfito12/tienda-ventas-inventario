const sucursalController=require('../Controllers/sucursalControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain

router.handle('add-sucursal',sucursalController.addSucursal)
router.handle('get-all-sucursales',sucursalController.getAllSucursal)
router.handle('get-sucursal',sucursalController.getSucursal)

module.exports=router