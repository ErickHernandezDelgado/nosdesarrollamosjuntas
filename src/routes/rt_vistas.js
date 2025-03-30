const express = require("express");
const route = express.Router()
const { vistas_principales, get_datos } = require("../controllers/ctrl_vista");
const { hasSession } = require("../middlewares/mdw_cookes");

route.get("/", [hasSession], vistas_principales.inicio);
route.get("/cerrar-sesion", (req, res) => {
    if(req.session.usuario){
        req.session.destroy();
    }
    return res.redirect("/inicio_sesion")
});
route.get("/session", (req, res) => {
    console.log(req.session)
    return res.json(req.session)
});

route.get("/registro", [hasSession], vistas_principales.registro);

route.get("/inicio_sesion", vistas_principales.iniciar_sesion);

route.get("/obtener-menarquia", [hasSession], get_datos.menarquia);
route.get("/obtener-registro/:fecha", [hasSession], get_datos.fechas);
route.get("/obtener-eventos", [hasSession], get_datos.eventos);

module.exports = route;