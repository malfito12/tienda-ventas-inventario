const controller={}
const dbConnection=require('../Database/dbConnection')
const conn=dbConnection()
const crypto=require('crypto')

controller.login=async(e,args)=>{
    const params=args
    const passcryto= crypto.createHash('md5').update(params.user_pass).digest('hex')
    try {
        const existUser = await conn.query(`SELECT * FROM users WHERE user_name=$1`, [params.user_name])
        if (existUser.rows.length === 0) {
            return JSON.stringify({ message: 'El usuario no existe', status: 300 })
        } else {
            const correctPass = await conn.query(`
            SELECT u.user_id,r.rol_name,u.user_status,u.people_name
            FROM users u
            INNER JOIN rols r ON r.rol_id=u.user_rol
            WHERE user_name=$1 AND user_password=$2`, 
            [params.user_name, passcryto])
            if (correctPass.rows.length > 0) {
                if(correctPass.rows[0].user_status==='ACTIVO'){
                    var user_id = correctPass.rows[0].user_id
                    var rol_name = correctPass.rows[0].rol_name
                    var people_name = correctPass.rows[0].people_name
                    return JSON.stringify({ status: 200, user_id: user_id, rol_name: rol_name,people_name:people_name })
                }else{
                    return JSON.stringify({ status: 300, message: 'La cuenta no esta activada, contactese con el Administrador' })
                }
            } else {
                return JSON.stringify({ status: 300, message: 'Contraseña Incorrecta' })
            }
        }
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300,message:'Error, No se pudo realizar la peticion'})
    }
}
module.exports=controller