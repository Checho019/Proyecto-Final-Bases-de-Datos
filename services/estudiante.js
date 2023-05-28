const db = require('../utils/dbController')

db.inicializar();

// Obtener estudiantes de convocatoria
const obtenerEstudiantes = async () => {
    let query = 'SELECT E.codestudiante cod, nombre, apellido, U.nomunidad unidad1, U2.nomunidad unidad2, nominstrumento, calificacion '
    + 'FROM estudiante E '
    + 'JOIN unidad U ON U.codunidad = E.codunidad ' 
    + 'JOIN unidad U2 ON U.uni_codunidad = U2.codunidad '
    + 'JOIN convocatoriaestudiante C ON C.codestudiante = E.codestudiante '
    + 'JOIN instrumento I ON I.idinstrumento = C.idinstrumento '
    + 'ORDER BY calificacion DESC'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado.rows
}

// Agregar estudiante a participantes (Seleccion)
const EstudianteParticipa = async () => {
    let query = 'INSERT INTO participacionestudiante '
    + 'VALUES ()'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado.rows
}

// llenar asistencia de estudiante 


module.exports = {
    obtenerEstudiantes
}