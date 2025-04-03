const { getConnection } = require("./connect")

module.exports = {
    reporte_menarquia: async (data) => {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.query(`
                SELECT 
                    u.menarquia as menarquia, 
                    m.tipo_menarquia as tipo_menarquia
                FROM usuarios u
                LEFT JOIN menarquia m on u.id = m.usuario
                where u.id = ?
            `, [...Object.values(data)])

            return { estatus: rows.length ? 1 : 2, data: rows.length ? rows[0] : [] };
        } catch (error) {
            console.error(error);
            throw error;
        }finally{
            if (connection) {
                connection.release();
            }
        }
    },
    reportes_registros: async (data) => {
        let connection;
        try {
            connection = await getConnection()
            const [rows] = await connection.query(`
                SELECT 
                    r.idreporte as id,
                    r.usuario as usuario,
                    co_flujo.label AS flujo,
                    GROUP_CONCAT(co_dolores.label) AS dolores,
                    co_estatus.label AS estatus,
                    r.fecha as fecha
                FROM reporte r
                LEFT JOIN catalogo_opciones co_flujo 
                    ON r.flujo = co_flujo.valor AND co_flujo.categoria = 'flujo'
                LEFT JOIN JSON_TABLE(r.dolores, '$[*]' COLUMNS (dolor_id VARCHAR(100) PATH '$')) jt
                    LEFT JOIN catalogo_opciones co_dolores 
                    ON jt.dolor_id = co_dolores.valor AND co_dolores.categoria = 'sensaciones_fisicas'
                LEFT JOIN catalogo_opciones co_estatus 
                    ON r.estatus = co_estatus.valor AND co_estatus.categoria = 'estatus'
                WHERE r.usuario = ? and r.fecha = ?
                GROUP BY r.idreporte;
            `, [...Object.values(data)]);

            return {data: rows};
        } catch (error) {
            console.error(error);
            throw error;
        }finally{
            if (connection) {
                connection.release();
            }
        }
    },
    reporte_eventos: async (data) => {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.query(`
                SELECT 
                    DATE_FORMAT(r.fecha, '%Y-%m-%d') as fecha, CAST(r.flujo AS UNSIGNED) AS flujo
                FROM reporte r
                WHERE r.usuario = ?
                ORDER BY r.fecha ASC
            `, [...Object.values(data)]);

            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            if (connection) {
                connection.release();
            }
        }
    },
    reporte_dia: async (data) => {
        let connection;
        try {
            connection = await getConnection();
            const [rows] = await connection.query(`
                    SELECT
                        *
                    FROM reporte
                    WHERE usuario = ? 
                    AND fecha = ?;
                `, [...Object.values(data)]);

            return rows;
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            if (connection) {
                connection.release();
            }
        }
    },
    reporte_crear: async (data) => {
        let connection;
        try {
            connection = await getConnection();
            await connection.query(`
                INSERT INTO 
                reporte
                (usuario, flujo, dolores, estatus, fecha)
                values
                (?, ?, ?, ?, ?);
            `, [...Object.values(data)])

            return {estatus: 1}
        } catch (error) {
            console.log(error);
            throw error;
        }finally{
            if (connection) {
                connection.release();
            }
        }
    }
}