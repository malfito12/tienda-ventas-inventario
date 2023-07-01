const controller = {}
const dbConnection = require('../Database/dbConnection')
const conn = dbConnection()

controller.addSucursal = async (e, args) => {
    const params = args
    console.log(params)
    try {
        const existSuc = await conn.query(`SELECT * FROM sucursales WHERE sucursal_name=$1`, [params.name_sucursal])
        if (existSuc.rows.length > 0) {
            return JSON.stringify({ message: 'El Nombre ya Existe, Intente con otro Nombre', status: 300 })
        }
        await conn.query(`INSERT INTO sucursales VALUES ($1,$2,$3,$4,$5)`,
            [
                params.name_sucursal,
                params.address_sucursal,
                params.dep_sucursal,
                params.phone_sucursal,
                params.user_id
            ]
        )
        return JSON.stringify({ message: 'Sucursal Registrado Correctamente', status: 200 })
    } catch (error) {
        return JSON.stringify({ message: 'Error, No se pudo registrar', status: 300 })
        console.log(error)
    }
}

controller.getAllSucursal = async () => {
    try {
        const result = await conn.query(`SELECT * FROM sucursales ORDER BY sucursal_name ASC`)
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controller.getSucursal = async (e, args) => {
    try {
        const result = await conn.query(`SELECT * FROM sucursales WHERE sucursal_id=$1`, [args])
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}
controller.editSucursal = async (e, args) => {
    const params = args
    // console.log(params)
    try {
        await conn.query(
            `UPDATE sucursales 
            SET sucursal_name=$1,sucursal_address=$2,sucursal_dep=$3,sucursal_phone=$4 WHERE sucursal_id=$5`,
            [params.name_sucursal, params.address_sucursal, params.dep_sucursal, params.phone_sucursal, params.sucursal_id])
        return JSON.stringify({ status: 200, message: 'Sucursal Actualizada Correctamente' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Actualizar' })
    }
}
controller.deleteSucursal = async (e, args) => {
    try {
        await conn.query(`DELETE FROM sucursales WHERE sucursal_id=$1`, [args])
        return JSON.stringify({ status: 200, message: 'Sucursal Eliminada' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo eliminar' })
    }
}



module.exports = controller