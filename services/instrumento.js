const db = require('../utils/dbController')

db.inicializar();

// Obtener la lista de instrumentos requeridos
const obtenerInstrumentos = async () => {
    let query = 'SELECT DISTINCT nominstrumento ' 
    + 'FROM instrumento I ' 
    + 'JOIN obrainstrumento O ON I.idinstrumento = O.idinstrumento WHERE O.idobra = 3 ORDER BY nominstrumento'
    const resultado = await db.ejecutarQuery(query,[])
    return resultado
}

module.exports = {
    obtenerInstrumentos
}

