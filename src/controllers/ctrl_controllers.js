const Cryptr = require("cryptr")
const cryptr = new Cryptr(process.env.SECRET_KEY)
const Usuarios = require("../models/usuarios");
const Reportes = require("../models/reportes");


const usuario = {
    iniciar_sesion: async (req, res) => {
        try {
            const { nombre, apellido, contraseña } = req.body;
            const objUsuario = new Usuarios(nombre, apellido, null, contraseña);
            const iniciar = await objUsuario.iniciarSesion();

            switch (iniciar.estatus) {
                case 1: {
                    req.session.usuario = {
                        usuario: cryptr.encrypt(iniciar.data[0].id),
                        nombre: "".concat(iniciar.data[0].nombre, iniciar.data[0].apellido)
                    }
                    return res.json({ estatus: 1, message: `Bienvenido ${"".concat(iniciar.data[0].nombre, " ", iniciar.data[0].apellido)}` })    
                }
                case 2: return res.json({ estatus: 2, info: "Usuario no existe" });
                default: return res.json({ estatus: 0, info: iniciar.message })
            }
        } catch (error) {
            console.log(error);
            res.json({ estatus: 0, info: "Error al cargar la vista "+error});
        }
    },
    registro: async (req, res) => {
        try {
            const { nombre, apellido, contraseña, edad, primerPeriodo, edadMenarquia, tipoMenarquia } = req.body;
            const menarquia = primerPeriodo ? true : false;
            const objUsuario = new Usuarios(nombre, apellido, edad, contraseña);
            
            if(await objUsuario.usuariosExistente()) return res.status(200).json({ estatus: 2, message: "El usuario ya existe"});
            const crear = await objUsuario.crearUsuario(menarquia);
            if(primerPeriodo) await objUsuario.generarMenarquia({id: crear.data, edadMenarquia, tipoMenarquia});
            
            return res.json({ estatus: 1, message: "Bienvenido ".concat(crear.info.nombre, " ", crear.info.apellido)});
        } catch (error) {
            console.error(error);
            return res.json({ estatus: 0, message: "Ha ocurrido un error "+error });
        }
    },
    reporte: async (req, res) => {
        try {
            console.log("entro");
            
            const { fecha, flujo, nivel_flujo, sintomas, emociones } = req.body;
            if(flujo == "") return res.status(400).json({ message: "El nivel de flujo es requerido si hubo flujo." });

            const objReporte = new Reportes(cryptr.decrypt(req.session.usuario.usuario));
            const reporteHoy = await objReporte.reportHoy();
            console.log(reporteHoy)
            if(reporteHoy.data) return res.status(400).json({ message: "Ya existe un reporte para esta fecha." });
            objReporte.reporteCrear({ flujo: nivel_flujo, dolores:  JSON.stringify(sintomas), estatus: emociones, fecha})
            return res.status(200).json({ message: "✅ Reporte registrado correctamente con opciones." })
        } catch (error) {
            console.log(error);
            return res.json({ estatus: 0, message: "Ha ocurrido un error "+error });  
        }
    }
}

module.exports = {
    usuario
}