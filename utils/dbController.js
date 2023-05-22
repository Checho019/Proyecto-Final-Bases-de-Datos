const oracledb = require('oracledb');

// Configuración de conexión a la base de datos
const dbConfig = {
    user: 'PROYECTO',
    password: '1234',
    connectString: 'localhost:1521/XEXDB'
}

// Crear Pool
const inicializar = async () => {
  await oracledb.createPool(dbConfig);
};

// Regresar conexión a la Pool
const cerrar = async () => {
  await oracledb.getPool().close();
};

// Ejecutar Query
const ejecutarQuery = async (sql, params) => {
  let connection;
  let result;

  try {
    connection = await oracledb.getConnection();
    result = await connection.execute(sql, params);
  } catch (error) {
    console.error('Error al ejecutar la consulta:', error);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error('Error al cerrar la conexión:', error);
      }
    }
  }
  return result;
};

module.exports = {
  inicializar,
  cerrar,
  ejecutarQuery
};