const db = require('../utils/dbController')

db.inicializar();

// Obtener la lista de todos los calendarios
const obtenerCalendario = async () => {
    let query = 'SELECT desctipocalendario, idestado, titulo, fechainicio, fechafin__ FROM calendario C JOIN tipocalendario T ON C.idtipocalen = T.idtipocalen JOIN obra O ON O.idobra = C.idobra WHERE O.idperido = 202301'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado.rows
}

// Saber cuantos calendarios estan activos
const cuantosActivos = async (calendario) => {
    let query = 'SELECT count(consecalendario) FROM calendario C JOIN tipocalendario T ON C.idtipocalen = T.idtipocalen where lower(idestado) = \'activo\' AND lower(desctipocalendario) = :calendario'
    const resultado = await db.ejecutarQuery(query,[calendario])
    return resultado.rows
}

// Saber si un tipo de calendario esta activo
const esActivo = async (calendario) => {
    const resultado = await cuantosActivos(calendario);
    return resultado.rows[0][0] == 0;
}

// Cambiar estado de un calendario
const inactivarCalendario = async (obra,calendario,id ) => {
    let query = 'UPDATE calendario SET idestado = \'Inactivo\' WHERE idobra = :obra AND idtipocalen = :calendario AND consecalendario = :id'
    return await db.ejecutarQuery(query,[Number(obra),Number(calendario),Number(id)]);
}

// Extraer horas de calendarios de ensayo y funcion
const retirarHoras = async () => {
    let query = 'SELECT C.idtipocalen, consecalendario, desctipocalendario, idestado, titulo, to_char(fechainicio,\'YYYY-MM-DD\'), TO_CHAR(fechainicio,\'HH24\'), to_char(fechafin__,\'YYYY-MM-DD\'),TO_CHAR(fechafin__,\'HH24\') FROM calendario C JOIN tipocalendario T ON C.idtipocalen = T.idtipocalen JOIN obra O ON O.idobra = C.idobra WHERE O.idperido = 202301'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado.rows
}

// Agregar calendario
const agregarCalendario = async (obra,calendario,id,fechaI, fechaF) => {
    let query = 'INSERT INTO calendario VALUES (:obra,:calendario,:id,\'Activo\',TO_DATE(:fechaI,\'DD/MM/YYYY HH24\'),TO_DATE(:fechaF,\'DD/MM/YYYY HH24\'))'
    await db.ejecutarQuery(query, [obra,calendario,id,fechaI,fechaF])
}

module.exports = {
    obtenerCalendario,
    cuantosActivos,
    esActivo,
    inactivarCalendario,
    agregarCalendario,
    retirarHoras
}
