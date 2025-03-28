const path = require("path");
const { dbConecction } = require("../db/connect");
const { get_usuarios } = require("../db/db_usuarios");


const vistas_principales = {
    inicio: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, "../../public/html/home.html"));
        } catch (error) {
            console.log(error)
            res.json({ info: "Error al cargar la vista", error })
        }
    },
    registro: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, "../../public/html/registro.html"));
        } catch (error) {
            console.log(error)
            res.json({ info: "Error al cargar la vista", error })
        }
    },
    iniciar_sesion: (req, res) => {
        try {
            res.sendFile(path.join(__dirname, "../../public/html/inicio_sesion.html"));
        } catch (error) {
            console.log(error)
            res.json({ info: "Error al cargar la vista", error })
        }
    }
}

const get_datos = {
    eventos: async (req, res) => {
        const userId = req.params.userId;
    
        const sql = `
            SELECT r.fecha, CAST(r.flujo AS UNSIGNED) AS flujo
            FROM reporte r
            WHERE r.usuario = ?
            ORDER BY r.fecha ASC
        `;
    
        db.query(sql, [userId], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener los eventos:", err);
                return res.status(500).json({ message: "Error al obtener los eventos." });
            }
    
            // Transformar los resultados en un formato adecuado para el calendario
            const eventos = results.map(evento => ({
                fecha: evento.fecha,
                sangrado: evento.flujo === 1 ? "si" : "no" // Convertir el flujo a "si" o "no"
            }));
    
            res.json(eventos);
        });
    },
    fechas: (req, res) => {
        const { userId, fecha } = req.params;
    
        const sql = `
            SELECT r.flujo, r.nivel_flujo,
                   GROUP_CONCAT(co.valor ORDER BY co.id SEPARATOR ', ') AS opciones
            FROM reporte r
            LEFT JOIN reporte_opciones ro ON r.idreporte = ro.idreporte
            LEFT JOIN catalogo_opciones co ON ro.idopcion = co.id
            WHERE r.usuario = ? AND r.fecha = ?
            GROUP BY r.flujo, r.nivel_flujo
        `;
    
        db.query(sql, [userId, fecha], (err, results) => {
            if (err) {
                console.error("❌ Error al obtener el reporte:", err);
                return res.status(500).json({ message: "Error al obtener el reporte." });
            }
    
            if (results.length > 0) {
                res.json({
                    sangrado: results[0].flujo === 1 ? "si" : "no",
                    intensidad: results[0].nivel_flujo || null,
                    sintomas: results[0].opciones ? results[0].opciones.split(', ') : []
                });
            } else {
                res.status(404).json({ message: "No hay reporte para esta fecha." });
            }
        });
    },
    menarquia: (req, res) => {
        const userId = req.params.id;
    
        const sql = `
            SELECT u.menarquia, m.tipo_menarquia 
            FROM usuarios u
            LEFT JOIN menarquia m ON u.id = m.usuario
            WHERE u.id = ?
        `;
    
        db.query(sql, [userId], (err, result) => {
            if (err) {
                console.error("❌ Error al obtener la menarquia:", err);
                res.status(500).json({ message: "Error al obtener la información." });
                return;
            }
    
            if (result.length > 0) {
                res.json({
                    menarquia: result[0].menarquia ? "sí" : "no",
                    tipoMenarquia: result[0].tipo_menarquia || "sin_menarquia"
                });
            } else {
                res.json({ menarquia: "no", tipoMenarquia: "sin_menarquia" });
            }
        });
    },
    //borrar apartir de aqui:
    usuarios: async (req, res) => {
        try {
            const result = await get_usuarios();
            return res.status(200).json({message: "Todo bien", data: result});
        } catch (error) {
            console.log(error)
            return res.json({mesage: "Ocurrio un error"})
        }
    }
}
module.exports = {vistas_principales, get_datos};