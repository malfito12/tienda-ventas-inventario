const loginController=require('../Controllers/loginControllers')
const { BrowserWindow, app, ipcMain } = require('electron')
const router=ipcMain

router.handle('login',loginController.login)
module.exports=router