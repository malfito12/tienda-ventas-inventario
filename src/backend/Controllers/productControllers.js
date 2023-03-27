const controller = {}
const dbConnection = require('../Database/dbConnection')
const conn = dbConnection()


//-------------------PRODUCTS-----------------------------

controller.postProduct = async (e, args) => {
    const params = args
    // console.log(params)
    try {
        await conn.query(
            `INSERT INTO products VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
            [
                params.product_name,
                params.product_price,
                params.product_price_unit,
                params.product_amount_box,
                params.product_image,
                params.product_code,
                new Date(),
                params.u_medida_id,
                params.type_id,
                params.user_id,
                params.sucursal_id,
            ]
        )
        return JSON.stringify({ status: 200, message: 'Producto Registrado Correctamente' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo registrar' })
    }
}

controller.getAllProducts = async (e, args) => {
    try {
        const array = []
        const result = await conn.query(
            `SELECT DISTINCT p.product_id,p.product_name,s.sucursal_name,p.product_image,p.product_price,p.product_price_unit,p.product_amount_box,p.product_code,s.sucursal_id,t.type_id,u.u_medida_id
            FROM products p
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            INNER JOIN product_types t ON t.type_id=p.type_id
            INNER JOIN u_medidas u ON u.u_medida_id=p.u_medida_id
            WHERE p.sucursal_id=$1`,
            [args]
        )
        for (var i = 0; i < result.rowCount; i++) {
            const ultimo = await conn.query(
                `SELECT ROUND(m.product_total_amount/p.product_amount_box,2) as stock,m.product_move_amount,m.product_move_price,m.product_total_amount,m.product_total_price,m.product_move_code,p.product_id,s.sucursal_id
                FROM products_move m
                INNER JOIN products p ON p.product_id=m.product_id
                INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
                WHERE s.sucursal_id=$1 AND p.product_id=$2
                ORDER BY m.product_move_id DESC LIMIT 1`,
                [args, result.rows[i].product_id]
            )
            array.push({ ...result.rows[i], ...ultimo.rows[0] })
        }
        // console.log(array)
        return JSON.stringify(array)
    } catch (error) {
        console.log(error)
    }
}

controller.updateProduct = async (e, args) => {
    const params = args
    try {
        await conn.query(
            `UPDATE products 
            SET product_name=$1,product_price=$2,product_price_unit=$3,product_amount_box=$4,product_image=$5,product_code=$6,u_medida_id=$7,type_id=$8 
            WHERE product_id=$9`,
            [
                params.product_name,
                params.product_price,
                params.product_price_unit,
                params.product_amount_box,
                params.product_image,
                params.product_code,
                params.u_medida_id,
                params.type_id,
                params.product_id
            ]
        )
        return JSON.stringify({ status: 200, message: 'Producto Actualizado' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Actualizar' })
    }
}

controller.deleteProduct = async (e, args) => {
    try {
        await conn.query(`DELETE FROM products WHERE product_id=$1`, [args])
        return JSON.stringify({ status: 200, message: 'Producto Eliminado Correctamente' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Eliminar, Existe Informacion Registrada con este Producto' })
    }
}


//------------------------------------------------------------
//------------------------------------------------------------
controller.postProductMoveIngreso = async (e, args) => {
    const params = args
    // console.log(params)
    try {
        var codigoEntrada = 'E-1'
        const codeUltimo = await conn.query(
            `SELECT * FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            WHERE m.move_id=1 AND p.sucursal_id=$1
            ORDER BY m.product_move_id DESC LIMIT 1`,
            [params.sucursal_id]
        )
        if (codeUltimo.rowCount > 0) {
            var cambio = codeUltimo.rows[0].product_move_code
            cambio = cambio.split('-')
            cambio = parseInt(cambio[1]) + 1
            codigoEntrada = 'E-' + cambio
        }
        const ultimo = await conn.query(
            `SELECT * FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            WHERE s.sucursal_id=$1 AND p.product_id=$2
            ORDER BY m.product_move_id DESC LIMIT 1`,
            [params.sucursal_id, params.product_id]
        )
        const product = await conn.query(`SELECT * FROM products WHERE product_id=$1`, [params.product_id])
        var newCant = 0
        if (product.rowCount > 0) {
            newCant = parseInt(product.rows[0].product_amount_box) * parseInt(params.product_move_amount)
        }
        // params.product_price,
        // params.product_price_unit,
        // params.product_amount_box,
        if (ultimo.rows.length === 0) {
            await conn.query(
                `INSERT INTO products_move VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
                [
                    // params.product_move_amount,
                    newCant,
                    params.product_move_price,
                    // params.product_move_amount,
                    newCant,
                    params.product_move_price,
                    codigoEntrada,
                    new Date(),
                    params.product_id,
                    params.move_id
                ]
            )
            return JSON.stringify({ status: 200, message: 'Producto Registrado Correctamente' })
        } else {
            // console.log('entra 2')
            var total_price = 0
            var total_stock = 0
            total_price = parseFloat(ultimo.rows[0].product_total_price) + (parseFloat(params.product_move_price))
            // total_stock = parseFloat(ultimo.rows[0].product_total_amount) + (parseFloat(params.product_move_amount))
            total_stock = parseFloat(ultimo.rows[0].product_total_amount) + (parseFloat(newCant))
            await conn.query(
                `INSERT INTO products_move VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
                [
                    // name_product.rows[0].product_name,
                    // params.product_move_amount,
                    newCant,
                    params.product_move_price,
                    total_stock,
                    total_price,
                    codigoEntrada,
                    new Date(),
                    params.product_id,
                    params.move_id
                ]
            )
            return JSON.stringify({ status: 200, message: 'Producto Registrado Correctamente' })
        }
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo registrar' })
    }
}




controller.getAllProductMove = async (e, args) => {
    try {
        const result = await conn.query(
            `SELECT DISTINCT p.product_id,p.product_name,p.product_price,p.product_amount,s.sucursal_name
            FROM products p
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            WHERE p.sucursal_id=$1`,
            [args]
        )
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controller.updateProductMove = async (e, args) => {
    const params = args
    try {
        await conn.query(
            `UPDATE products SET product_name=$1,product_amount=$2,product_price=$3, WHERE product_id=$4`,
            [
                params.product_name,
                params.product_amount,
                params.product_price,
                params.product_id
            ]
        )
        return JSON.stringify({ status: 200, message: 'Producto Actualizado' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Actualizar' })
    }
}

controller.deleteProductMove = async (e, args) => {
    try {
        await conn.query(`DELETE FROM products WHERE product_id=$1`, [args])
        return JSON.stringify({ status: 200, message: 'Producto Eliminado Correctamente' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo Eliminar' })
    }
}


//----------------------VENTA DE PRODUCTOS-----------------------
controller.postProductMoveVenta = async (e, args) => {
    const params = args.data
    const recibo = args.recibo
    // console.log(params)
    try {
        var codigoVenta = 'V-1'
        const codeUltimo = await conn.query(
            `SELECT * FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            WHERE m.move_id=2 AND p.sucursal_id=$1
            ORDER BY m.product_move_id DESC LIMIT 1`,
            [recibo.sucursal_id]
        )
        if (codeUltimo.rowCount > 0) {
            var cambio = codeUltimo.rows[0].product_move_code
            cambio = cambio.split('-')
            cambio = parseInt(cambio[1]) + 1
            codigoVenta = 'V-' + cambio
        }
        for (var i = 0; i < params.length; i++) {
            const ultimo = await conn.query(
                `SELECT * FROM products_move m
                INNER JOIN products p ON p.product_id=m.product_id
                INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
                WHERE s.sucursal_id=$1 AND p.product_id=$2
                ORDER BY m.product_move_id DESC LIMIT 1`,
                [params[i].sucursal_id, params[i].product_id]
            )
            if (ultimo.rowCount === 0) {
                return JSON.stringify({ message: `Error, No existe Stock de Producto en ${params[i].product_name}`, status: 300 })
            } else {
                var total_price = 0
                var total_stock = 0
                var cantReal=params[i].cantidad
                if (params[i].type_amount === 'Caja') {
                    cantReal=parseFloat(params[i].cantidad) * parseFloat(params[i].product_amount_box)
                    total_price = parseFloat(ultimo.rows[0].product_total_price) - (parseFloat(params[i].price))
                    total_stock = parseFloat(ultimo.rows[0].product_total_amount) - (parseFloat(params[i].cantidad) * parseFloat(params[i].product_amount_box))

                } else {
                    total_price = parseFloat(ultimo.rows[0].product_total_price) - (parseFloat(params[i].price))
                    total_stock = parseFloat(ultimo.rows[0].product_total_amount) - (parseFloat(params[i].cantidad))
                }

                await conn.query(
                    `INSERT INTO products_move VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
                    [
                        // params[i].product_name,
                        // params[i].cantidad,
                        cantReal,
                        params[i].price,
                        total_stock,
                        total_price,
                        codigoVenta,
                        new Date(),
                        params[i].product_id,
                        2
                    ]
                )
            }
        }
        //---------REGISTRO RECIBO-----------------
        await conn.query(
            `INSERT INTO product_ventas VALUES ($1,$2,$3,$4,$5,$6)`,
            [
                // recibo.client_name,
                recibo.product_total_price,
                recibo.product_venta_price,
                codigoVenta,
                recibo.sucursal_id,
                recibo.client_id,
                recibo.user_id
            ]
        )
        return JSON.stringify({ status: 200, message: 'Venta Registrada' })
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo registrar' })
    }
}

//---------------KARDEX DE PRODUCTOS--------------------------
controller.getkardexProduct = async (e, args) => {
    const params = args
    // console.log(params)
    try {
        const result = await conn.query(
            `SELECT p.product_name,ROUND(m.product_move_amount/p.product_amount_box,2) as product_move_amount,m.product_move_price,ROUND(m.product_total_amount/p.product_amount_box,2) as product_total_amount,m.product_total_price,m.move_id,m.product_move_code,TO_CHAR(m.product_move_register_date,'YYYY-MM-DD')
            FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            WHERE s.sucursal_id=$1 AND p.product_id=$2
            ORDER BY m.product_move_id ASC`,
            [params.sucursal_id, params.product_id]
        )
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo registrar' })
    }
}
module.exports = controller