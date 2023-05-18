const controller = {}
const dbConnection = require('../Database/dbConnection')
const conn = dbConnection()


//-------------------PRODUCTS-----------------------------

controller.postProduct = async (e, args) => {
    const params = args
    // console.log(params)
    try {
        const exist_code=await conn.query(`SELECT * FROM products WHERE product_code=$1 AND sucursal_id=$2`,[params.product_code,params.sucursal_id,])
        if(exist_code.rowCount>0){
            return JSON.stringify({status:300, message:'Error, El condigo de Producto ya Existe'})
        }
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
            `SELECT DISTINCT p.product_id,p.product_name,s.sucursal_name,p.product_image,p.product_price,p.product_price_unit,p.product_amount_box,p.product_code,s.sucursal_id,t.type_id,t.type_name,u.u_medida_id
            FROM products p
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            INNER JOIN product_types t ON t.type_id=p.type_id
            INNER JOIN u_medidas u ON u.u_medida_id=p.u_medida_id
            WHERE p.sucursal_id=$1`,
            [args]
        )
        for (var i = 0; i < result.rowCount; i++) {
            const ultimo = await conn.query(
                // `SELECT ROUND(m.product_total_amount/p.product_amount_box,2) as stock,m.product_move_amount,m.product_move_price,m.product_total_amount,m.product_total_price,m.product_move_code,p.product_id,s.sucursal_id
                `SELECT ROUND(m.stock/p.product_amount_box,2) as stock,p.product_id,s.sucursal_id
                FROM stock_products m
                INNER JOIN products p ON p.product_id=m.product_id
                INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
                WHERE s.sucursal_id=$1 AND p.product_id=$2
                ORDER BY m.stock_id DESC LIMIT 1`,
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

controller.getSpecificProducts=async(e,args)=>{
    const type_id=args.type_id
    const idSuc=args.idSuc
    try {
        const result=await conn.query(
            `SELECT p.product_id,p.product_name, p.product_image
            FROM products p
            WHERE p.type_id=$1 AND p.sucursal_id=$2 ORDER BY p.product_name ASC`,
            [type_id,idSuc]
        )
        return JSON.stringify(result.rows)
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

        const ultimoStock = await conn.query(
            `SELECT * FROM stock_products t
            INNER JOIN products p ON p.product_id=t.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            WHERE s.sucursal_id=$1 AND p.product_id=$2
            ORDER BY t.stock_id DESC LIMIT 1`,
            [params.sucursal_id, params.product_id]
        )
        const product = await conn.query(`SELECT * FROM products WHERE product_id=$1`, [params.product_id])
        var newCant = 0
        if (product.rowCount > 0) {
            newCant = parseInt(product.rows[0].product_amount_box) * parseInt(params.product_move_amount)
            newCant = newCant + parseInt(params.product_move_amount_unit)
        }
        var total_stock = 0
        if (ultimoStock.rowCount === 0) {
            await conn.query(`INSERT INTO stock_products VALUES ($1,$2,$3)`, [newCant, params.product_id, new Date()])
        } else {
            total_stock = parseFloat(ultimoStock.rows[0].stock) + parseFloat(newCant)
            await conn.query(`INSERT INTO stock_products VALUES ($1,$2,$3)`, [total_stock, params.product_id, new Date()])
        }

        await conn.query(
            `INSERT INTO products_move VALUES($1,$2,$3,$4,$5,$6)`,
            [
                newCant,
                params.product_move_price,
                codigoEntrada,
                new Date(),
                params.product_id,
                params.move_id
            ]
        )
        return JSON.stringify({ status: 200, message: 'Producto Registrado Correctamente' })
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
            const ultimoStock = await conn.query(
                `SELECT * FROM stock_products m
                INNER JOIN products p ON p.product_id=m.product_id
                INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
                WHERE s.sucursal_id=$1 AND p.product_id=$2
                ORDER BY m.stock_id DESC LIMIT 1`,
                [params[i].sucursal_id, params[i].product_id]
            )
            if (ultimoStock.rowCount === 0) {
                return JSON.stringify({ message: `Error, No existe Stock de Producto en ${params[i].product_name}`, status: 300 })
            } else {
                var newCant = params[i].cantidad
                var total_stock = 0
                if (params[i].type_amount === 'Caja') {
                    newCant = parseFloat(params[i].cantidad) * parseFloat(params[i].product_amount_box)
                    total_stock = parseFloat(ultimoStock.rows[0].stock) - (newCant)
                } else {
                    total_stock = parseFloat(ultimoStock.rows[0].stock) - (parseFloat(params[i].cantidad))
                }
                await conn.query(`INSERT INTO stock_products VALUES ($1,$2,$3)`, [total_stock, params[i].product_id, new Date()])
                await conn.query(
                    `INSERT INTO products_move VALUES($1,$2,$3,$4,$5,$6)`,
                    [
                        newCant,
                        params[i].price,
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
            `INSERT INTO product_ventas VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
                // recibo.client_name,
                recibo.product_total_price,
                recibo.product_venta_price,
                codigoVenta,
                new Date(),
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

//-------------- LISTA DE REGISTRO DE VENTAS--------------------------
controller.getAllRegisterVentas = async (e, args) => {
    const params = args
    try {
        const result = await conn.query(
            `SELECT v.product_venta_price,v.product_venta_code,to_char(v.register_date,'YYYY-MM-DD'), u.people_name,c.client_name,c.client_surname_p,c.client_surname_m,c.client_ci
            FROM product_ventas v
            INNER JOIN users u ON u.user_id=v.user_id
            INNER JOIN clients c ON c.client_id=v.client_id
            WHERE v.sucursal_id=$1
            ORDER BY register_date DESC`
            , [params])
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
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
        // return JSON.stringify({ status: 300, message: 'Error, No se pudo registrar' })
    }
}

//---------------------CIERRE-DE-CAJA-------------------------------
controller.getAllProductCaja = async (e, args) => {
    const params = args
    try {
        const result = await conn.query(
            // `SELECT t.type_name,p.product_name,ROUND(m.product_move_amount/p.product_amount_box,2) as product_move_amount,m.product_move_price,ROUND(m.product_total_amount/p.product_amount_box,2) as product_total_amount,m.product_total_price,m.move_id,m.product_move_code,TO_CHAR(m.product_move_register_date,'YYYY-MM-DD')
            `SELECT 1 as number,m.product_move_id,t.type_name,p.product_name,ROUND(m.product_move_amount/p.product_amount_box,2) as product_move_amount,m.product_move_price,m.move_id,m.product_move_code,TO_CHAR(m.product_move_register_date,'YYYY-MM-DD')
            FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            INNER JOIN product_types t ON t.type_id=p.type_id
            WHERE s.sucursal_id=$1 AND m.move_id=1
            ORDER BY m.product_move_id ASC`,
            [params]
        )
        const result2 = await conn.query(
            // `SELECT t.fechaFin,t.descripcion,t.total
            `SELECT t.semana_id,TO_CHAR(t.register_date,'YYYY-MM-DD'),t.descripcion,t.total
            FROM total_semana t
            WHERE t.sucursal_id=$1 AND register_mes=1`, [params])
        var cambio = []
        for (var i = 0; i < result2.rowCount; i++) {
            cambio.push({
                number: 2,
                semana_id: result2.rows[i].semana_id,
                to_char: result2.rows[i].to_char,
                product_name: result2.rows[i].descripcion,
                type_name: result2.rows[i].descripcion,
                move_id: 2,
                product_move_amount: 0,
                product_move_price: result2.rows[i].total
            })
        }
        // console.log(cambio)
        var data = [...result.rows, ...cambio]
        data.sort((a, b) => new Date(a.to_char) - new Date(b.to_char))
        // return JSON.stringify(result.rows)
        return JSON.stringify(data)
    } catch (error) {
        console.log(error)
    }
}

//---------------GET INGRESOS EGRESOS CAJA SEMANAL---------------------------------
controller.getAllMovimientosCajaSemana = async (e, args) => {
    const params = args
    try {
        const result = await conn.query(
            // `SELECT 1 as number, m.product_move_id,t.type_name,p.product_name,ROUND(m.product_move_amount/p.product_amount_box,2) as product_move_amount,m.product_move_price,ROUND(m.product_total_amount/p.product_amount_box,2) as product_total_amount,m.product_total_price,m.move_id,m.product_move_code,TO_CHAR(m.product_move_register_date,'YYYY-MM-DD')
            `SELECT 1 as number, m.product_move_id,t.type_name,p.product_name,ROUND(m.product_move_amount/p.product_amount_box,2) as product_move_amount,m.product_move_price,m.move_id,m.product_move_code,TO_CHAR(m.product_move_register_date,'YYYY-MM-DD')
            FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            INNER JOIN product_types t ON t.type_id=p.type_id
            WHERE s.sucursal_id=$1 AND m.move_id!=1
            ORDER BY m.product_move_id ASC`,
            [params]
        )
        const result2 = await conn.query(
            `SELECT i.ing_eg_id, TO_CHAR(i.register_date,'YYYY-MM-DD'),i.description_mov,i.motivo_mov,i.move_id,i.monto_mov
            FROM ingresos_egresos_caja i
            WHERE i.sucursal_id=$1 AND i.move_id!=1 `, [params])
        var cambio = []
        for (var i = 0; i < result2.rowCount; i++) {
            cambio.push({
                number: 2,
                ing_eg_id: result2.rows[i].ing_eg_id,
                to_char: result2.rows[i].to_char,
                product_name: result2.rows[i].description_mov,
                type_name: result2.rows[i].motivo_mov,
                move_id: result2.rows[i].move_id,
                product_move_amount: 0,
                product_move_price: result2.rows[i].monto_mov,
            })
        }
        var data = [...result.rows, ...cambio]
        // console.log(data)
        data.sort((a, b) => new Date(a.to_char) - new Date(b.to_char))
        const data2 = []
        var sum = 0
        for (var i = 0; i < data.length; i++) {
            if (data[i].move_id === 4) {
                sum = parseFloat(sum) - parseFloat(data[i].product_move_price)
            } else {
                sum = parseFloat(sum) + parseFloat(data[i].product_move_price)
            }
            data2.push({
                ...data[i],
                total: sum.toFixed(2)
            })
        }
        // las vanderas 107 73445773
        return JSON.stringify(data2)
    } catch (error) {
        console.log(error)
    }
}
//---------------MOVIMIENTO INGRESOS EGRESOS CAJA CHICA---------------------------------
controller.postIngresosEgresos = async (e, args) => {
    const params = args
    try {
        await conn.query(
            `INSERT INTO ingresos_egresos_caja VALUES($1,$2,$3,$4,$5,$6)`,
            [
                params.descripcion_mov,
                params.motivo_mov,
                params.monto_mov,
                params.tipo_mov,
                new Date(),
                params.sucursal_id,
            ]
        )
        return JSON.stringify({ status: 200, message: 'Movimiento Caja se realizó Correctamente' })
    } catch (error) {
        console.log(error)
    }
}


//-----------------LIBRO DIARIO--------------------------
controller.getLibroDiarioProduct = async (e, args) => {
    const params = args
    // console.log(params)
    try {
        const result = await conn.query(
            `SELECT t.type_name,p.product_name,ROUND(m.product_move_amount/p.product_amount_box,2) as product_move_amount,m.product_move_price,ROUND(m.product_total_amount/p.product_amount_box,2) as product_total_amount,m.product_total_price,m.move_id,m.product_move_code,TO_CHAR(m.product_move_register_date,'YYYY-MM-DD')
            FROM products_move m
            INNER JOIN products p ON p.product_id=m.product_id
            INNER JOIN sucursales s ON s.sucursal_id=p.sucursal_id
            INNER JOIN product_types t ON t.type_id=p.type_id
            WHERE s.sucursal_id=$1 AND m.move_id=2
            ORDER BY m.product_move_id ASC`,
            [args]
        )
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
        // return JSON.stringify({ status: 300, message: 'Error, No se pudo registrar' })
    }
}
//-------------REGISTRO SEMANA----------------------
controller.registroSemana = async (e, args) => {
    const libro_semana = args.libro_semana
    const total_semana = args.total_semana
    try {
        const existe = await conn.query(`SELECT * FROM total_semana WHERE fechaInicio=$1 AND fechaFin=$2 AND sucursal_id=$3`, [total_semana.fechaInicio, total_semana.fechaFin, total_semana.sucursal_id])
        if (existe.rowCount > 0) {
            return JSON.stringify({ status: 300, message: 'Los Registros de esa Semana ya existen, verifique que los datos sean correctos' })
        } else {

            for (var i = 0; i < libro_semana.length; i++) {
                await conn.query(`INSERT INTO libro_semana VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
                    [
                        libro_semana[i].to_char,
                        libro_semana[i].product_name,
                        libro_semana[i].type_name,
                        libro_semana[i].product_move_price,
                        libro_semana[i].product_move_amount,
                        libro_semana[i].total,
                        total_semana.fechaInicio,
                        total_semana.fechaFin,
                        libro_semana[i].move_id,
                        total_semana.sucursal_id
                    ])
                if (libro_semana[i].number === 1) {
                    await conn.query(`DELETE FROM products_move WHERE product_move_id=$1`, [libro_semana[i].product_move_id])
                } else {
                    await conn.query(`DELETE FROM ingresos_egresos_caja WHERE ing_eg_id=$1`, [libro_semana[i].ing_eg_id])
                }
                await conn.query('DELETE FROM product_ventas WHERE product_venta_code=$1', [libro_semana[i].product_move_code])
            }
            await conn.query(`INSERT INTO total_semana VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                [
                    'Registro de Semana',
                    total_semana.ingreso,
                    total_semana.egreso,
                    total_semana.total,
                    total_semana.fechaInicio,
                    total_semana.fechaFin,
                    1,
                    new Date(),
                    total_semana.sucursal_id
                ])
            return JSON.stringify({ status: 200, message: 'Success, Informacion Guardada' })
        }
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo guardar' })
    }
}
//------------GET LIBRO SEMANA---------------------------------------
controller.getLibroSemana = async (e, args) => {
    const params = args
    try {
        const result1 = await conn.query(`SELECT * FROM total_semana WHERE fechaInicio=$1 AND fechaFin=$2 AND sucursal_id=$3`, [params.fechaInicio, params.fechaFin, params.sucursal_id])
        const result2 = await conn.query(`SELECT * FROM libro_semana WHERE fechaInicio=$1 AND fechaFin=$2 AND sucursal_id=$3 ORDER BY register_date ASC`, [params.fechaInicio, params.fechaFin, params.sucursal_id])
        if (result1.rowCount > 0 && result2.rowCount > 0) {
            return JSON.stringify({ status: 200, dataTotal: result1.rows, dataLibro: result2.rows, message: 'Success, Datos Encontrados' })
        } else {
            return JSON.stringify({ status: 300, message: 'Error, No existe Informacion' })
        }
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo buscar la informacion' })
    }
}

//---------------POST BALANCE MENSUAL----------------------
controller.registroBalanceMensual = async (e, args) => {
    const libro_mes = args.libro_mes
    const total_mes = args.total_mes
    try {
        const existe = await conn.query(`SELECT * FROM total_mes WHERE mes=$1 AND anio=$2 AND sucursal_id=$3`, [total_mes.anio, total_mes.mes, total_mes.sucursal_id])
        if (existe.rowCount > 0) {
            return JSON.stringify({ status: 300, message: 'El Registro de ese mes ya existe, verifque que los datos sean correctos' })
        } else {
            for (var i = 0; i < libro_mes.length; i++) {
                await conn.query(`INSERT INTO libro_mes VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
                    [
                        libro_mes[i].to_char,
                        libro_mes[i].product_name,
                        libro_mes[i].type_name,
                        libro_mes[i].move_id,
                        libro_mes[i].product_move_amount,
                        libro_mes[i].product_move_price,
                        total_mes.anio,
                        total_mes.mes,
                        total_mes.sucursal_id
                    ])
                if (libro_mes[i].number === 1) {
                    await conn.query(`DELETE FROM products_move WHERE product_move_id=$1`, [libro_mes[i].product_move_id])
                } else {
                    await conn.query(`UPDATE total_semana SET register_mes=2 WHERE semana_id=$1`, [libro_mes[i].semana_id])
                }
            }
            await conn.query(`INSERT INTO total_mes VALUES ($1,$2,$3,$4,$5,$6,$7)`,
                [
                    total_mes.ingreso,
                    total_mes.egreso,
                    total_mes.total,
                    total_mes.anio,
                    total_mes.mes,
                    new Date(),
                    total_mes.sucursal_id
                ])
            return JSON.stringify({ status: 200, message: 'Success, Informacion Guardada' })
        }
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo guardar' })
    }
}

//-----------------------GET LIBRO MENSUAL-------------------------------
controller.getLibroMensual = async (e, args) => {
    const params = args
    try {
        const result1 = await conn.query(`SELECT * FROM libro_mes WHERE anio=$1 AND mes=$2 AND sucursal_id=$3 ORDER BY register_date ASC`, [params.anio, params.mes, params.sucursal_id])
        const result2 = await conn.query(`SELECT * FROM total_mes WHERE anio=$1 AND mes=$2 AND sucursal_id=$3`, [params.anio, params.mes, params.sucursal_id])
        if (result1.rowCount > 0 && result2.rowCount > 0) {
            return JSON.stringify({ status: 200, dataLibro: result1.rows, dataTotal: result2.rows, message: 'Success, Datos Encontrados' })
        } else {
            return JSON.stringify({ status: 300, message: 'Error, Datos No Encontrados' })
        }
    } catch (error) {
        console.log(error)
        return JSON.stringify({ status: 300, message: 'Error, No se pudo encontrar la información' })
    }
}
module.exports = controller
