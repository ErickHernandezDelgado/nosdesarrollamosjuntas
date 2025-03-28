const express = require("express");
const app = express();
const path = require("path");
const PORT = 3800;


// Middleware para manejar JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rutas de vistas
app.use(require(path.join(__dirname, "./src/routes/rt_vistas.js")))
app.use(require(path.join(__dirname, "./src/routes/rt_controllers.js")))

// Iniciar el servidor
app.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en port", PORT);
});