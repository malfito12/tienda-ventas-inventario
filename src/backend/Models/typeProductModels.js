const typeProductControllers=require('../Controllers/typeProductControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain


router.handle('post-type-product',typeProductControllers.postTypeProduct)
router.handle('get-all-type-product',typeProductControllers.getAllTypeProduct)
router.handle('update-type-product',typeProductControllers.updateTypeProduct)
router.handle('delete-type-product',typeProductControllers.deleteTypeProduct)

module.exports=router