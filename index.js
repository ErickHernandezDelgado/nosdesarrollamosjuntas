require("dotenv").config()
const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");
const PORT = 3800;

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.PORT
});

db.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err.stack);
        return;
    }
    console.log("✅ Conectado a MySQL con el ID", db.threadId);
});

// Middleware para manejar JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rutas de vistas
app.use(require(path.join(__dirname, "./src/routes/rt_vistas.js")))
app.use(require(path.join(__dirname, "./src/routes/tr_controllers.js")))

// Iniciar el servidor
app.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en port", PORT);
});