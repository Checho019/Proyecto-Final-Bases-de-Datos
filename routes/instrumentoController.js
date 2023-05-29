const instrumentos = require('../services/instrumento')
const express = require('express');

const router = express.Router();

router.get('/', async (req,res) => {
    const resultado = await instrumentos.obtenerInstrumentos()
    res.json(resultado) 
})

module.exports = router