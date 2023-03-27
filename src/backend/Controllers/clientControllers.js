const controllers = {}
const dbConnection = require('../Database/dbConnection')
const conn = dbConnection()

controllers.registerClient = async (e, args) => {
    const params = args
    try {
        conn.query(`INSERT INTO clients VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
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
        const result =await conn.query(`SELECT * FROM clients`)
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

controllers.searchClient=async(e,args)=>{
    try {
        const result=await conn.query(`SELECT * FROM clients WHERE client_ci=$1`,[args])
        return JSON.stringify(result.rows)
    } catch (error) {
        console.log(error)
    }
}

module.exports = controllers