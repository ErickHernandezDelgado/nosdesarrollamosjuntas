const Cryptr = require("cryptr")
const cryptr = new Cryptr(process.env.SECRET_KEY)
const { dbConecction } = require("../db/connect");
const { usuario_existe, usuario_alta } = require("../db/db_usuarios");

class Usuarios {
    nombre;
    apellido;
    edad;
    _contrasena;

    constructor(nombre, apellido, edad = null, _contrasena = null) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad; 
        this._contrasena = _contrasena
    }
    //Metodo para verificar si el usuario existe o no dentro de la base de datos
    //para evitar duplicidad de datos
    async usuariosExistente () {
        try {
            const existe = await usuario_existe({nombre: this.nombre, apellido: this.apellido})
            console.log(existe)
            return existe.length ? true : false
        } catch (error) {
            console.error(error);
            return false
        }
    }
    //Metodo para dar de alta usuarios;
    async crearUsuario (isMenarquia) {
        try {
            const { estatus, data } = await usuario_alta({nombre: this.nombre, apellido:this.apellido,
                contrasena: this._contrasena, edad: this.edad, menarquia: isMenarquia
            })

            return { estatus, data: cryptr.encrypt(data) }
        } catch (error) {
            console.error(error);
            return {estatus: 0, message: "Ha ocurrido un erorr " + error}
        }
    }
}

module.exports = Usuarios;