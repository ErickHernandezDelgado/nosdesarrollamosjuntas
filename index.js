require("dotenv").config()
const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql2");
const PORT = 3800;

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
    port: process.env.PORT
});

db.connect(err => {
    if (err) {
        console.error("❌ Error al conectar a MySQL:", err.stack);
        return;
    }
    console.log("✅ Conectado a MySQL con el ID", db.threadId);
});

// Middleware para manejar JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Rutas de vistas
app.get("/", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "public/html/inicio_sesion.html"));
    } catch (error) {
        console.log(error)
        res.json({ info: "Error al cargar la vista", error })
    }
});

app.get("/registro", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "public/html/registro.html"));
    } catch (error) {
        console.log(error)
        res.json({ info: "Error al cargar la vista", error })
    }
});

app.get("/inicio_sesion", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "public/html/inicio_sesion.html"));
    } catch (error) {
        console.log(error)
        res.json({ info: "Error al cargar la vista", error })
    }
});

app.get("/home", (req, res) => {
    try {
        res.sendFile(path.join(__dirname, "public/html/home.html"));
    } catch (error) {
        console.log(error)
        res.json({ info: "Error al cargar la vista", error })
    }
});

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

// Nueva ruta para obtener la información de la menarquia del usuario
app.get("/obtener-menarquia/:id", (req, res) => {
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

// Nueva ruta para obtener los eventos del calendario del usuario
// Nueva ruta para obtener los eventos del calendario del usuario
app.get("/obtener-eventos/:userId", (req, res) => {
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
});

app.get("/obtener-registro/:userId/:fecha", (req, res) => {
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
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log("🚀 Servidor corriendo en port", PORT);
});