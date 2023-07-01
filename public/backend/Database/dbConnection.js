const pg=require('pg')

const database=()=>{
    if(!pg){
        console.log('Error, Base de Datos no conectada')
    }else{
        const pool= new pg.Pool({
            host: 'localhost',
            // user: 'root',
            user: 'postgres',
            password: 'root',
            port: '5432',
            database: 'administracion'
            // database: 'ventas_almacen'
        })
        // const pool= new pg.Pool({
        //     host: 'postgresql-109149-0.cloudclusters.net',
        //     user: 'malfito12',
        //     password: 'vivabraun123',
        //     port: '10239',
        //     database: 'mercado_campesino'
        // })
        return pool
    }
    
}
module.exports=database