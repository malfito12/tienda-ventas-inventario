const controller={}
const dbConnection=require('../Database/dbConnection')
const conn=dbConnection()

controller.postTypeProduct=async(e,args)=>{
    const params=args
    try {
        await conn.query(
            `INSERT INTO product_types VALUES($1,$2,$3)`,
            [params.type_name, new Date(),params.user_id]
        )
        return JSON.stringify({status:200,message:'Tipo de Producto Registrado Correctamente'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300, message: 'Error, No se pudo registrar'})
    }
}

controller.getAllTypeProduct=async(e,args)=>{
    try {
        const result=await conn.query(`SELECT * FROM product_types`)
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controller.updateTypeProduct=async(e,args)=>{
    const params=args
    try {
        await conn.query(`UPDATE product_types SET type_name=$1 WHERE type_id=$2`,[params.type_name,params.type_id])
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

module.exports=controller