const db = require('../utils/dbController')

const run = async () => {
    await db.inicializar();
    id = await maxId()
}

// Obtener max id
const maxId = async () => {
    let query = 'SELECT MAX(consecasis) '
    + 'FROM participacionestudiante'
    const resultado = await db.ejecutarQuery(query,[])
    id = resultado.rows.length > 0 ? resultado.rows[0][0] : 0
    return id;
}

var id = 0
let s = run()

// Obtener estudiantes de convocatoria
const obtenerEstudiantes = async () => {
    let query = 'SELECT E.codestudiante cod, nombre, apellido, U.nomunidad unidad1, U2.nomunidad unidad2, nominstrumento, calificacion '
    + 'FROM estudiante E '
    + 'JOIN unidad U ON U.codunidad = E.codunidad ' 
    + 'JOIN unidad U2 ON U.uni_codunidad = U2.codunidad '
    + 'JOIN convocatoriaestudiante C ON C.codestudiante = E.codestudiante '
    + 'JOIN instrumento I ON I.idinstrumento = C.idinstrumento '
    + 'ORDER BY nominstrumento ASC, calificacion DESC'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado
}

// Agregar estudiante a participantes (Seleccion)
const EstudianteParticipa = async (codigo,consCalen) => {
    id++
    let query = 'INSERT INTO participacionestudiante '
    + 'VALUES (:id,3,2,:consCalen,:codigo)'
    return await db.ejecutarQuery(query,[id,consCalen,codigo])
}



// llenar asistencia de estudiante 
const asistencia = async (codigo,consCalen,tipoCal) => {
    id++
    let query = 'INSERT INTO participacionestudiante '
    + 'VALUES (:id,3,:tipoCal,:consCalen,:codigo)'
    return await db.ejecutarQuery(query,[id,tipoCal,consCalen,codigo])
}

// Lista de participantes
const participantes = async () => {
    let query = 'SELECT DISTINCT P.codestudiante, nombre, apellido '
    + 'FROM participacionestudiante P '
    + 'JOIN estudiante E ON P.codestudiante = E.codestudiante'
    const result = await db.ejecutarQuery(query,[])
    return result;
}

// Obtener ids de ensayos y funciones
const ensayosFunciones = async () => {
    let query = 'SELECT idtipocalen, consecalendario '
    + 'FROM calendario '
    + 'WHERE (idtipocalen = 4 OR idtipocalen = 5) AND lower(idestado) = \'activo\''
    const result = await db.ejecutarQuery(query,[])
    return result;
}

// Llenar todas las asistencias de manera satisfactoria
const llenarTodaAsistencia = async () => {
    const ef = await ensayosFunciones()
    const part = await participantes();
    ef.rows.map(async row => {
        part.rows.forEach(async est => {
            const res = await asistencia(est[0], row[1], row[0])
        })
    })
}

// Estudiantes que han aprovado la condicion de electiva
const estudiantesElectiva = async () => {
    let query = 'SELECT E.codestudiante, nombre, apellido, correo, nomunidad '
    + 'FROM estudiante E '
    + 'JOIN unidad U ON E.codunidad = U.codunidad '
    + 'JOIN participacionestudiante P ON P.codestudiante = E.codestudiante '
    + 'GROUP BY E.codestudiante, nombre, apellido, correo, nomunidad '
    + 'HAVING COUNT(idobra) = ' 
    + '(SELECT count(idobra) FROM calendario WHERE idtipocalen = 4 OR idtipocalen = 5)'
    const result = await db.ejecutarQuery(query,[])
    return result;
}

module.exports = {
    obtenerEstudiantes,
    EstudianteParticipa,
    participantes,
    asistencia,
    llenarTodaAsistencia,
    estudiantesElectiva
}