const controller={}
const dbConnection=require('../Database/dbConnection')
const conn=dbConnection()

controller.postTypeProduct=async(e,args)=>{
    const params=args
    try {
        await conn.query(
            `INSERT INTO product_types VALUES($1,$2,$3,$4)`,
            [params.type_name, new Date(),params.user_id,params.sucursal_id]
        )
        return JSON.stringify({status:200,message:'Tipo de Producto Registrado Correctamente'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300, message: 'Error, No se pudo registrar'})
    }
}

controller.getAllTypeProduct=async(e,args)=>{
    try {
        const result=await conn.query(`
        SELECT * FROM product_types WHERE sucursal_id=$1 ORDER BY type_name ASC`,[args])
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controller.updateTypeProduct=async(e,args)=>{
    const params=args
    try {
        await conn.query(`UPDATE product_types SET type_name=$1 WHERE type_id=$2 AND sucursal_id=$3`,[params.type_name,params.type_id,params.sucursal_id])
        return JSON.stringify({status:200,message:'Tipo de Producto Actualizado'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300,message:'Error, No se pudo Actualizar'})   
    }
}

controller.deleteTypeProduct=async(e,args)=>{
    try {
        await conn.query(`DELETE FROM product_types WHERE type_id=$1`,[args])
        return JSON.stringify({status:200,message:'Tipo de Producto Eliminado Correctamente'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300,message:'Error, No se pudo Eliminar'})
    }
}
//-----------------PRODUCTO ESPECIFICO----------------------------
controller.getSpecificProduct=async(e,args)=>{
    try {
        const result=await conn.query(`SELECT p.product_code FROM products p WHERE type_id=$1 ORDER BY product_id DESC LIMIT 1`,[args])
        if(result.rowCount>0){
            return JSON.stringify(result.rows)
        }
        return JSON.stringify('')
    } catch (error) {
        console.log(error)
    }
}

module.exports=controller