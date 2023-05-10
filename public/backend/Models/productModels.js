const productControllers=require('../Controllers/productControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain


router.handle('post-product-move-ingreso',productControllers.postProductMoveIngreso)
router.handle('post-product-move-venta',productControllers.postProductMoveVenta)
router.handle('get-all-move-semana',productControllers.getAllMovimientosCajaSemana)
router.handle('post-libro-semana',productControllers.registroSemana)
router.handle('get-libro-semana',productControllers.getLibroSemana)
router.handle('post-balance-mes',productControllers.registroBalanceMensual)
router.handle('get-libro-mes',productControllers.getLibroMensual)
// router.handle('delete-product',productControllers.deleteProduct)


//-------------PRODUCTS---------------

router.handle('post-product',productControllers.postProduct)
router.handle('get-all-products',productControllers.getAllProducts)
router.handle('get-specific-products',productControllers.getSpecificProducts)
router.handle('update-product',productControllers.updateProduct)
router.handle('delete-product',productControllers.deleteProduct)

//---------------KARDEX----------------------------------------
router.handle('get-kardex-product',productControllers.getkardexProduct)


//------------------CAJA------------------------------

router.handle('get-all-products-caja',productControllers.getAllProductCaja)
router.handle('post-ingreso-egreso-caja',productControllers.postIngresosEgresos)
router.handle('get-all-products-libro',productControllers.getLibroDiarioProduct)

//-------------------VENTAS-----------------------------------------
router.handle('get-all-register-ventas',productControllers.getAllRegisterVentas)

module.exports=router