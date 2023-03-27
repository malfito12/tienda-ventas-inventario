const unidadMedidaControllers=require('../Controllers/unidadMedidaControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain


router.handle('post-unidad-medida',unidadMedidaControllers.postUnidadMedida)
router.handle('get-all-unidad-medida',unidadMedidaControllers.getAllUnidadMedida)
router.handle('update-unidad-medida',unidadMedidaControllers.updateUnidadMedida)
router.handle('delete-unidad-medida',unidadMedidaControllers.deleteUnidadMedida)

module.exports=router