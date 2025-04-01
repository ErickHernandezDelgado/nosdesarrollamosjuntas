const { dbConecction } = require("./connect")

module.exports = {
    //Views
    get_usuarios: async () => {
        try {
            const [rows] = await dbConecction.query("SELECT * FROM usuarios");
            return rows;
        } catch (error) {
            console.log(error);
            throw error;            
        }
    },
    iniciar_sesion: async (data) => {
      try {
        const [rows] = await dbConecction.query(`
                SELECT id as id, nombre as nombre, 
                apellido as apellido, edad as edad
                FROM usuarios
                where nombre = ? and apellido = ?
                and contrasena = ?
            `, [...Object.values(data)])

        return rows;
      } catch (error) {
        console.error(error);
        throw error;
      }  
    },
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

            const [rows] = await dbConecction.query(`SELECT LAST_INSERT_ID() as last_id, 
                nombre as nombre, apellido as apellido FROM usuarios WHERE id=LAST_INSERT_ID();`)
            return {estatus: 1, data: rows[0] };
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    generar_menarquia: async (data) => {
        try {
            await dbConecction.query(`
                INSERT INTO menarquia 
                (usuario, edad, tipo_menarquia)
                    values
                (?,?,?)
                `, [...Object.values(data)]);
                
            return {estatus: 1}
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}