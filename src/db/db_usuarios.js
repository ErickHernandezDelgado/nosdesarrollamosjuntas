const { dbConecction } = require("./connect")

module.exports = {
    //Views
    usuario_existe: async (data) => {
        try {
            const [rows] = await dbConecction.query(`SELECT * FROM usuarios where nombre like ? 
                                                        and apellido like ?`, [...Object.values(data)]);

            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },
    //CRUD actions
    usuario_alta: async (data) => {
        try {
            await dbConecction.query(`
                INSERT INTO usuarios
                    (nombre, apellido, contrasena, edad, menarquia)
                    values
                    (?,?,?,?,?);`
                , [...Object.values(data)]);

            const [rows] = await dbConecction.query(`SELECT LAST_INSERT_ID() as last_id;`)
            return {estatus: 1, data: rows[0].last_id };
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}