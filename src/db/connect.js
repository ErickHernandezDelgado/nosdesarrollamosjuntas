require("dotenv").config()
const mysql = require("mysql2");

let dbConecction = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.PORT
}).promise();

async function connectDb (){
    try {
        await dbConecction.connect()
        console.log("✅ Conectado")
    } catch (error) {
        console.log("❌ error", error)
    }
};

connectDb();

module.exports = {dbConecction, connectDb};