const Cryptr = require("cryptr");
const { reporte_menarquia, reportes_registros, reporte_eventos, reporte_dia, reporte_crear } = require("../db/db_reportes");
const cryptr = new Cryptr(process.env.SECRET_KEY);

class Reportes {
    _userId;

    constructor(_userId) {
        this._userId = _userId;
    }
    // Obtener si existe algun reporte creado el dia presente
    async reportHoy( fecha ){
        try {
            const resultado = await reporte_dia({ id: this._userId, fecha });
            return { estatus: 1, data: resultado.length ? true : false  }
        } catch (error) {
            console.error(error);
            return { estatus: 0, message: "Ha ocurrido un eror: "+error };
        }
    }
    // Obtener los reportes de la menarquia
    async reporteMenarquia() {
        try {
            const { estatus, data } = await reporte_menarquia({ id: cryptr.decrypt(this._userId) });
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
    // Crear el reporte
    async reporteCrear(data = {}){
        try {
            await reporte_crear({id: this._userId, ...data});
            return { estatus: 1 }
        } catch (error) {
            console.error(error);
            return { estatus: 0, message: "Ha ocurrido un error: "+error };
        }
    }
    
}

module.exports = Reportes;