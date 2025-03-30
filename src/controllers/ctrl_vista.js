const Cryptr = require("cryptr")
const cryptr = new Cryptr(process.env.SECRET_KEY)
const path = require("path");
const Reportes = require("../models/reportes");


const vistas_principales = {
    inicio: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, "../../public/html/home.html"));
        } catch (error) {
            console.log("Erorr en el home: ", error);
            res.json({ estatus: 0, info: "Error al cargar la vista "+error});
        }
    },
    registro: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, "../../public/html/registro.html"));
        } catch (error) {
            console.log("Error en el registro: ", error);
            res.json({ estatus: 0, info: "Error al cargar la vista "+error});
        }
    },
    iniciar_sesion: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, "../../public/html/inicio_sesion.html"));
        } catch (error) {
            console.log("Iniciar sesion", error);
            res.json({ estatus: 0, info: "Error al cargar la vista "+error});
        }
    }
}

const get_datos = {
    eventos: async (req, res) => {
        try {
            const objReporte = new Reportes(cryptr.decrypt(req.session.usuario.usuario));
            const eventos = await objReporte.reporteEventos();

            const resultados = eventos.data.map((e)=>({
                fecha: e.fecha,
                sangrado: e.flujo === 1 ? "si" : "no"
            }));

            return res.json({data: resultados})
        } catch (error) {
            console.error(error);
            return res.json({ estatus: 0, info: "Error al cargar la vista "+error});
        }
        // const userId = req.params.userId;
    
        // const sql = `
        //     SELECT r.fecha, CAST(r.flujo AS UNSIGNED) AS flujo
        //     FROM reporte r
        //     WHERE r.usuario = ?
        //     ORDER BY r.fecha ASC
        // `;
    
        // db.query(sql, [userId], (err, results) => {
        //     if (err) {
        //         console.error("❌ Error al obtener los eventos:", err);
        //         return res.status(500).json({ message: "Error al obtener los eventos." });
        //     }
    
        //     // Transformar los resultados en un formato adecuado para el calendario
        //     const eventos = results.map(evento => ({
        //         fecha: evento.fecha,
        //         sangrado: evento.flujo === 1 ? "si" : "no" // Convertir el flujo a "si" o "no"
        //     }));
    
        //     res.json(eventos);
        // });
    },
    fechas: async (req, res) => {
        try {
            const { fecha } = req.params;
            const objReporte = new Reportes(cryptr.decrypt(req.session.usuario.usuario));
            const { estatus, data } = await objReporte.reporteRegistros(fecha);

            return res.json({ estatus: 1, 
                sangrado: data[0].flujo === 1 ? "si" : "no",
                intensidad: data[0].nivel_flujo || null,
                sintomas: data[0].dolores.split(",")
            })
        } catch (error) {
            console.log(error);
            return res.json({ estatus: 0, message: "Ha ocurrido un error: "+error });
        }
    
        // const sql = `
        //     SELECT r.flujo, r.nivel_flujo,
        //            GROUP_CONCAT(co.valor ORDER BY co.id SEPARATOR ', ') AS opciones
        //     FROM reporte r
        //     LEFT JOIN reporte_opciones ro ON r.idreporte = ro.idreporte
        //     LEFT JOIN catalogo_opciones co ON ro.idopcion = co.id
        //     WHERE r.usuario = ? AND r.fecha = ?
        //     GROUP BY r.flujo, r.nivel_flujo
        // `;
    
        // db.query(sql, [userId, fecha], (err, results) => {
        //     if (err) {
        //         console.error("❌ Error al obtener el reporte:", err);
        //         return res.status(500).json({ message: "Error al obtener el reporte." });
        //     }
    
        //     if (results.length > 0) {
        //         res.json({
        //             sangrado: results[0].flujo === 1 ? "si" : "no",
        //             intensidad: results[0].nivel_flujo || null,
        //             sintomas: results[0].opciones ? results[0].opciones.split(', ') : []
        //         });
        //     } else {
        //         res.status(404).json({ message: "No hay reporte para esta fecha." });
        //     }
        // });
    },
    menarquia: async (req, res) => {
        try {
            const objReporte = new Reportes(req.session.usuario.usuario);
            const {estatus, data} = await objReporte.reporteMenarquia()
            console.log("De la clase Reporte: ", estatus, data)
            return res.json({ estatus, data: {
                menarquia: data.menarquia ? "sí" : "no",
                tipoMenarquia: data.tipoMenarquia} 
            })
        } catch (error) {
            console.log(error);
            return res.json({ estatus: 0, message: "Ha ocurrido un error: "+error})
        }
    },
}
module.exports = {vistas_principales, get_datos};