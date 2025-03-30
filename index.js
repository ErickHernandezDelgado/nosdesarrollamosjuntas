require("dotenv").config()
const express = require("express");
const session = require("express-session")
const path = require("path");

const app = express();
const PORT = 3800;


// Middleware para manejar JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge: 1000 * 60 * 30
    }
}))

// Rutas de vistas
app.use(require(path.join(__dirname, "./src/routes/rt_vistas.js")))
app.use(require(path.join(__dirname, "./src/routes/rt_controllers.js")))

// Iniciar el servidor
app.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en port", PORT);
});