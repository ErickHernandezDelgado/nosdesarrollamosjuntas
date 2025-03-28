const path = require("path");
const express = require("express");
const { vistas_principales, get_datos } = require("../controllers/ctrl_vista");
const Usuarios = require("../models/usuarios");
const route = express.Router()

route.get("/", vistas_principales.inicio);

route.get("/registro", vistas_principales.registro);

route.get("/inicio_sesion", vistas_principales.iniciar_sesion);

route.get("/obtener-eventos/:userId", get_datos.eventos);
route.get("/obtener-registro/:userId/:fecha", get_datos.fechas);
route.get("/obtener-menarquia/:id", get_datos.menarquia);

module.exports = route;