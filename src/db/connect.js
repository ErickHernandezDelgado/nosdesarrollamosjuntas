require("dotenv").config()
const mysql = require("mysql2");

let pool= mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.PORT,
    waitForConnections: true, // Espera si todas las conexiones están en uso
    connectionLimit: 10, // Número máximo de conexiones en el pool
        queueLimit: 0, // Cola ilimitada para solicitudes de conexión
}).promise();

// async function connectDb (){
//     try {
//         await dbConecction.connect()
//         console.log("✅ Conectado")
//     } catch (error) {
//         console.log("❌ error", error)
//     }
// };

async function getConnection() {
    return pool.getConnection();
}

module.exports = {pool, getConnection};