const db = require('../utils/dbController')

db.inicializar();

// Validar empleado
const obtenerDocente = async (correo, cedula) => {
    let query = 'SELECT nombre, apellido FROM empleado WHERE correo = :correo AND cedula = :cedula'
    const resultado = await db.ejecutarQuery(query,[correo,cedula])
    return resultado.rows
}

module.exports = obtenerDocente;