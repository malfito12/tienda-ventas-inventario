const userControllers=require('../Controllers/userControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain


router.handle('post-user',userControllers.postUser)
router.handle('get-all-users',userControllers.getAllUsers)
router.handle('update-user',userControllers.updateUser)
router.handle('delete-user',userControllers.deleteUser)

//--------ESTADO----------------------------
router.handle('status-user',userControllers.statusUser)

//-----ROLS-------------
router.handle('get-all-rols',userControllers.getAllRols)

module.exports=router