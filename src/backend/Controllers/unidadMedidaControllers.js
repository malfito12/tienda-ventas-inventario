const controller={}
const dbConnection=require('../Database/dbConnection')
const conn=dbConnection()

controller.postUnidadMedida=async(e,args)=>{
    const params=args
    // console.log(params)
    try {
        await conn.query(
            `INSERT INTO u_medidas VALUES($1,$2,$3)`,
            [params.u_medida_name, new Date(),params.user_id]
        )
        return JSON.stringify({status:200,message:'Unidad de Medida Registrado Correctamente'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300, message: 'Error, No se pudo registrar'})
    }
}

controller.getAllUnidadMedida=async(e,args)=>{
    try {
        const result=await conn.query(`SELECT * FROM u_medidas`)
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controller.updateUnidadMedida=async(e,args)=>{
    const params=args
    try {
        await conn.query(`UPDATE u_medidas SET u_medida_name=$1 WHERE u_medida_id=$2`,[params.u_medida_name,params.u_medida_id])
        return JSON.stringify({status:200,message:'Unidad de Medida Actualizado'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300,message:'Error, No se pudo Actualizar'})   
    }
}

controller.deleteUnidadMedida=async(e,args)=>{
    try {
        await conn.query(`DELETE FROM u_medidas WHERE u_medida_id=$1`,[args])
        return JSON.stringify({status:200,message:'Unidad de Medida Eliminado'})
    } catch (error) {
        console.log(error)
        return JSON.stringify({status:300,message:'Error, No se pudo Eliminar, Existen Registro con este dato'})
    }
}

module.exports=controller