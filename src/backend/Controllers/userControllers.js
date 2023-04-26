const controller = {}
const dbConnection = require('../Database/dbConnection')
const conn = dbConnection()
const crypto = require('crypto')

controller.postUser = async (e, args) => {
    const params = args
    const passCrypto = crypto.createHash('md5').update(params.user_password).digest('hex')
    // console.log(params)
    try {
        await conn.query(
            `INSERT INTO users VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                params.people_name,
                params.user_name,
                params.user_email,
                passCrypto,
                params.user_repeat_password,
                params.user_status,
                new Date(),
                params.rol_id,
            ]
        )
        return JSON.stringify({ status: 200, message: 'Usuario Registrado Correctamente' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo registrar' })
    }
}

controller.getAllUsers = async (e, args) => {
    try {
        const result = await conn.query(
            `SELECT * FROM users u
            INNER JOIN rols r ON r.rol_id=u.user_rol ORDER BY u.people_name ASC`
        )
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controller.updateUser = async (e, args) => {
    const params = args
    try {
        await conn.query(
            `UPDATE users 
            SET people_name=$1, user_name=$2, user_email=$3, user_rol=$4 WHERE user_id=$5`,
            [params.people_name, params.user_name,params.user_email,params.rol_id,params.user_id]
        )
        return JSON.stringify({ status: 200, message: 'Usuario Actualizado' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Actualizar' })
    }
}

controller.deleteUser = async (e, args) => {
    try {
        await conn.query(`DELETE FROM users WHERE user_id=$1`, [args])
        return JSON.stringify({ status: 200, message: 'Usuario Eliminado' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Eliminar, Existen Registro con este dato' })
    }
}
controller.statusUser = async (e, args) => {
    const params = args
    var status = ''
    if (params.user_status === 1) {
        status = 'ACTIVO'
    } else {
        status = 'BAJA'
    }
    try {
        await conn.query(`UPDATE users SET user_status=$1 WHERE user_id=$2`, [status, params.user_id])
        return JSON.stringify({ status: 200, message: 'Estado Actualizado' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Eliminar, Existen Registro con este dato' })
    }
}




//-------------------ROLES--------------------------

controller.getAllRols = async (e, args) => {
    try {
        const result = await conn.query(`SELECT * FROM rols`)
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

//---------------CAMBIO DE CONTRASEÑA--------------------------
controller.changePass=async(e,args)=>{
    const params=args
    const passCrypto = crypto.createHash('md5').update(params.newPass).digest('hex')
    try {
        await conn.query('UPDATE users SET user_password=$1,user_repeat_password=$2 WHERE user_id=$3',[passCrypto,params.reNewPass,params.user_id])
        return JSON.stringify({status:200,message:'El Cambio de Contraseña se realizó Correctamente'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300,message:'Error, No se puedo Cambiar la contraseña'})
    }
}

module.exports = controller