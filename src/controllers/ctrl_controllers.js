const Cryptr = require("cryptr")
const cryptr = new Cryptr(process.env.SECRET_KEY)
const Usuarios = require("../models/usuarios");


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
    }
}

module.exports = {
    usuario
}