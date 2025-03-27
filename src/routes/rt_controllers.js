const path = require("path");
const express = require("express");
const route = express.Router()

// ✅ Ruta para registrar usuario en la base de datos
app.post("/registro", (req, res) => {
    console.log("📥 Datos recibidos en /registro:", req.body);
    const { nombre, apellido, contraseña, edad, primerPeriodo, edadMenarquia, tipoMenarquia } = req.body;

    const menarquia = primerPeriodo ? true : false;

    const sqlUsuario = "INSERT INTO usuarios (nombre, apellido, contrasena, edad, menarquia) VALUES (?, ?, ?, ?, ?)";
    db.query(sqlUsuario, [nombre, apellido, contraseña, edad, menarquia], (err, result) => {
        if (err) {
            console.error("❌ Error al registrar usuario:", err);
            res.status(500).json({ message: "Error al registrar usuario." });
            return;
        }

        const userId = result.insertId;

        if (primerPeriodo) {
            const sqlMenarquia = "INSERT INTO menarquia (usuario, edad, tipo_menarquia) VALUES (?, ?, ?)";
            db.query(sqlMenarquia, [userId, edadMenarquia, tipoMenarquia], (err) => {
                if (err) {
                    console.error("❌ Error al registrar menarquia:", err);
                    res.status(500).json({ message: "Error al registrar información de menarquia." });
                    return;
                }
                res.json({ message: "✅ Usuario y menarquia registrados correctamente" });
            });
        } else {
            res.json({ message: "✅ Usuario registrado correctamente (sin menarquia)" });
        }
    });
});

// ✅ Ruta para manejar el inicio de sesión
app.post("/login", (req, res) => {
    const { nombre, apellido, contraseña } = req.body;
    const sql = `
        SELECT u.id, u.nombre, u.apellido, u.edad, u.menarquia, 
               m.edad AS edad_menarquia, m.tipo_menarquia
        FROM usuarios u
        LEFT JOIN menarquia m ON u.id = m.usuario
        WHERE u.nombre = ? AND u.apellido = ? AND u.contrasena = ?
    `;

    db.query(sql, [nombre, apellido, contraseña], (err, result) => {
        if (err) {
            console.error("❌ Error al hacer la consulta:", err);
            res.status(500).json({ message: "Error al iniciar sesión." });
            return;
        }
        if (result.length > 0) {
            res.json({ mensaje: "✅ Inicio de sesión exitoso", usuario: result[0] });
        } else {
            res.json({ mensaje: "❌ Credenciales incorrectas" });
        }
    });
});

// ✅ Ruta para registrar el reporte diario
app.post("/registrar-reporte", (req, res) => {
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