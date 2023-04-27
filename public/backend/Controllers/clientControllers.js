const controllers = {}
const dbConnection = require('../Database/dbConnection')
const conn = dbConnection()

controllers.registerClient = async (e, args) => {
    const params = args
    try {
        await conn.query(`INSERT INTO clients VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
                params.client_name,
                params.client_surname_p,
                params.client_surname_m,
                params.client_ci,
                params.client_phone,
                params.client_address,
                new Date(),
                params.user_id
            ])
        return JSON.stringify({ status: 200, message: 'Cliente Registrado Conrrectamente' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Registrar' })
    }
}

controllers.getAllClients = async (e, args) => {
    try {
        const result = await conn.query(`SELECT * FROM clients`)
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controllers.updateClient = async (e, args) => {
    const params = args
    // console.log(args)
    try {
        await conn.query(
            `UPDATE clients 
            SET client_name=$1, client_surname_p=$2, client_surname_m=$3, client_ci=$4, client_phone=$5, client_address=$6
            WHERE client_id=$7`,
            [
                params.client_name,
                params.client_surname_p,
                params.client_surname_m,
                params.client_ci,
                params.client_phone,
                params.client_address,
                params.client_id,
            ]
        )
        return JSON.stringify({status:200,message:'Datos Actualizados Correctamente'})
    } catch (error) {
        return JSON.stringify({status:300, message:'Error, El Numero de Cedual de Indentidad ya se encuentra Registrado'})
    }
}

controllers.deleteClient=async(e,args)=>{
    try {
        await conn.query(`DELETE FROM clients WHERE client_id=$1`,[args])
        return JSON.stringify({status:200,message:'Cliente eliminado'})
    } catch (error) {
        return JSON.stringify({status:300,message:'Error, Nose Pudo Eliminar'})
    }
}

controllers.searchClient = async (e, args) => {
    try {
        const result = await conn.query(`SELECT * FROM clients WHERE client_ci=$1`, [args])
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}


//-------------------RECIBO---------------------------------
controllers.imprimirRecibo = async (e, args) => {
    const params = args
    try {
        const result = await conn.query(
            `SELECT t.type_name, p.product_name,p.sucursal_id,ROUND(m.product_move_amount/p.product_amount_box,2) as product_move_amount,m.product_move_price,m.product_move_code 
            FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN product_types t ON t.type_id=p.type_id
            WHERE m.product_move_code=$1 AND p.sucursal_id=$2`,
            [params.code, params.sucursal_id]
        )
        const result2 = await conn.query(
            `SELECT p.product_venta_price FROM product_ventas p WHERE p.product_venta_code=$1 AND sucursal_id=$2`,
            [params.code, params.sucursal_id]
        )
        const data = { data: result.rows, precio_venta: result2.rows[0].product_venta_price }
        if (result.rowCount > 0 && result2.rowCount > 0) {
            return JSON.stringify({ status: 200, data: data })
        }
        return JSON.stringify({ status: 300, message: 'Error, No existen datos' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: error })
    }
}

module.exports = controllers