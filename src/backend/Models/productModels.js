const productControllers=require('../Controllers/productControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain


router.handle('post-product-move-ingreso',productControllers.postProductMoveIngreso)
router.handle('post-product-move-venta',productControllers.postProductMoveVenta)
// router.handle('get-all-products',productControllers.getAllProducts)
// router.handle('update-product',productControllers.updateProduct)
// router.handle('delete-product',productControllers.deleteProduct)


//-------------PRODUCTS---------------

router.handle('post-product',productControllers.postProduct)
router.handle('get-all-products',productControllers.getAllProducts)
router.handle('update-product',productControllers.updateProduct)
router.handle('delete-product',productControllers.deleteProduct)

//---------------KARDEX----------------------------------------
router.handle('get-kardex-product',productControllers.getkardexProduct)

module.exports=router