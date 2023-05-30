const db = require('../utils/dbController')

const run = async () => {
    await db.inicializar();
    id = await maxId()
}

// Obtener max id
const maxId = async () => {
    let query = 'SELECT MAX(consecalendario) '
    + 'FROM calendario'
    const resultado = await db.ejecutarQuery(query,[])
    id = resultado.rows.length > 0 ? resultado.rows[0][0] : 0
    return id;
}

var id = 0
let s = run()

// Obtener la lista de todos los calendarios
const obtenerCalendario = async () => {
    let query = 'SELECT desctipocalendario, idestado, titulo, fechainicio, fechafin__ FROM calendario C JOIN tipocalendario T ON C.idtipocalen = T.idtipocalen JOIN obra O ON O.idobra = C.idobra WHERE O.idperido = 202301'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado
}

// Saber cuantos calendarios estan activos
const cuantosActivos = async (calendario) => {
    let query = 'SELECT DISTINCT desctipocalendario FROM calendario C JOIN tipocalendario T ON C.idtipocalen = T.idtipocalen where lower(idestado) = \'inactivo\' AND lower(desctipocalendario) = :calendario'
    const resultado = await db.ejecutarQuery(query,[calendario])
    return resultado
}

// Saber si un tipo de calendario esta activo
const esActivo = async (calendario) => {
    const resultado = await cuantosActivos(calendario);
    return resultado.rows.length !== 0;
}

// Cambiar estado de un calendario
const inactivarCalendario = async (calendario,id ) => {
    let query = 'UPDATE calendario SET idestado = \'Inactivo\' WHERE idobra = 3 AND idtipocalen = :calendario '
    if (calendario > 3){
        query += 'AND consecalendario = :id'
        await db.ejecutarQuery(query,[calendario,id]);
    } else {
        await db.ejecutarQuery(query,[calendario]);
    }
}

// Extraer horas de calendarios de ensayo y funcion
const retirarHoras = async () => {
    let query = 'SELECT C.idtipocalen, consecalendario, desctipocalendario, idestado, titulo, to_char(fechainicio,\'YYYY-MM-DD\'), TO_CHAR(fechainicio,\'HH24\'), to_char(fechafin__,\'YYYY-MM-DD\'),TO_CHAR(fechafin__,\'HH24\') FROM calendario C JOIN tipocalendario T ON C.idtipocalen = T.idtipocalen JOIN obra O ON O.idobra = C.idobra WHERE O.idperido = 202301 ORDER BY consecalendario DESC'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado
}

// Agregar calendario
const agregarCalendario = async (calendario,fechaI, fechaF) => {
    id++
    let query = 'INSERT INTO calendario VALUES (3,:calendario,:id,\'Activo\',TO_DATE(:fechaI,\'DD/MM/YYYY HH24\'),TO_DATE(:fechaF,\'DD/MM/YYYY HH24\'))'
    await db.ejecutarQuery(query, [calendario,id,fechaI,fechaF])
}

// Ninguno activo
const ningunoActivo = async () => {
    let query = 'SELECT consecalendario FROM calendario WHERE lower(idestado) = \'activo\' '
    const resultado = await db.ejecutarQuery(query,[])
    return resultado.rows.length == 0
}

module.exports = {
    obtenerCalendario,
    cuantosActivos,
    esActivo,
    inactivarCalendario,
    agregarCalendario,
    retirarHoras,
    ningunoActivo
}
