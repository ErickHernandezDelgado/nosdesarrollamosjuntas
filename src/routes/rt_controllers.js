const path = require("path");
const express = require("express");
const db = require("../db/connect");
const { usuario } = require("../controllers/ctrl_controllers");
const Usuarios = require("../models/usuarios");
const route = express.Router()

// ✅ Ruta para registrar usuario en la base de datos
route.post("/registro", async (req, res) => {
    console.log("📥 Datos recibidos en /registro:", req.body);
    const { nombre, apellido, contraseña, edad, primerPeriodo, edadMenarquia, tipoMenarquia } = req.body;

    const menarquia = primerPeriodo ? true : false;
    const objUsuario = new Usuarios(nombre, apellido, edad, contraseña);

    if(await objUsuario.usuariosExistente()) return res.status(200).json({ estatus: 2, message: "El usuario ya existe"});

    const crear = await objUsuario.crearUsuario(menarquia);
    if(primerPeriodo) await objUsuario.generarMenarquia(crear.data);

    return res.json({ estatus: 1, message: "Bienvenido ".concat(crear.info.nombre, " ", crear.info.apellido)})
});

// ✅ Ruta para manejar el inicio de sesión
route.post("/login", usuario.iniciar_sesion);

// ✅ Ruta para registrar el reporte diario
route.post("/registrar-reporte", (req, res) => {
    const { usuario, fecha, flujo, nivel_flujo, opciones } = req.body;

    if (flujo === 1 && !nivel_flujo) {
        return res.status(400).json({ message: "El nivel de flujo es requerido si hubo flujo." });
    }

    // Verificar si ya existe un reporte para ese usuario y fecha
    const checkSql = "SELECT * FROM reporte WHERE usuario = ? AND fecha = ?";
    db.query(checkSql, [usuario, fecha], (err, results) => {
        if (err) {
            console.error("❌ Error al verificar el reporte existente:", err);
            return res.status(500).json({ message: "Error al verificar el reporte." });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Ya existe un reporte para esta fecha." });
        }

        // Insertar el reporte principal
        const sql = "INSERT INTO reporte (usuario, fecha, flujo, nivel_flujo) VALUES (?, ?, ?, ?)";
        console.log("Valores a insertar:", usuario, fecha, flujo, nivel_flujo); // Agrega este log
        db.query(sql, [usuario, fecha, flujo, nivel_flujo], (err, result) => {
            if (err) {
                console.error("❌ Error al registrar el reporte:", err);
                return res.status(500).json({ message: "Error al registrar el reporte." });
            }

            const idreporte = result.insertId;

            // Guardar las opciones seleccionadas (sensaciones físicas y estados emocionales)
            if (opciones && opciones.length > 0) {
                const insertOpciones = opciones.map(opcion => [idreporte, opcion]);

                const sqlOpciones = "INSERT INTO reporte_opciones (idreporte, idopcion) VALUES ?";
                db.query(sqlOpciones, [insertOpciones], (err) => {
                    if (err) {
                        console.error("❌ Error al registrar las opciones del reporte:", err);
                        return res.status(500).json({ message: "Error al registrar las opciones del reporte." });
                    }
                    res.status(200).json({ message: "✅ Reporte registrado correctamente con opciones." });
                });
            } else {
                res.status(200).json({ message: "✅ Reporte registrado correctamente, sin opciones." });
            }
        });
    });
});

module.exports = route;