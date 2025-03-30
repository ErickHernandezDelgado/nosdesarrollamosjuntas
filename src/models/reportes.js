const Cryptr = require("cryptr");
const { reporte_menarquia, reportes_registros, reporte_eventos } = require("../db/db_reportes");
const cryptr = new Cryptr(process.env.SECRET_KEY);

class Reportes {
    _userId;

    constructor(_userId) {
        this._userId = _userId;
    }
    // Obtener los reportes de la menarquia
    async reporteMenarquia() {
        try {
            const { estatus, data } = await reporte_menarquia({ id: cryptr.decrypt(this._userId) });
            console.log("Data info", estatus, data)
            return { estatus, data: {
                menarquia: data.menarquia,
                tipoMenarquia: estatus == 1 ? data.tipo_menarquia : "sin_menarquia" } 
            }
        } catch (error) {
            console.error(error);
            return { estatus: 0, message: "Ha ocurrido un error: "+ error };
        }
    }
    // Obtener los reportez
    async reporteRegistros(fecha) {
        try {
            const resultado = await reportes_registros({id: this._userId, fecha})
            return { estatus: resultado ? 1 : 0, data: resultado }
        } catch (error) {
            console.error(error);
            return { estatus: 0, message: "Ha ocurrido un error: "+ error}
        }
    }
    // Obtener los eventos
    async reporteEventos(){
        try {
            const resultado = await reporte_eventos({id: this._userId});
            return { estatus: resultado ? 1 : 2, data: resultado}
        } catch (error) {
            console.log(error);
            return { estatus: 0, message: "Ha ocurrido un erorr: "+error };
        }
    }
}

module.exports = Reportes;