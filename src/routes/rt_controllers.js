const express = require("express");
const { usuario } = require("../controllers/ctrl_controllers");
const { hasSession } = require("../middlewares/mdw_cookes");
const route = express.Router()

// ✅ Ruta para registrar usuario en la base de datos
route.post("/registro", usuario.registro);

// ✅ Ruta para manejar el inicio de sesión
route.post("/login", usuario.iniciar_sesion);

// ✅ Ruta para registrar el reporte diario
route.post("/registrar-reporte", [hasSession], usuario.reporte);

module.exports = route;