const express = require('express');
const calendar = require('../services/calendario')

const router = express.Router();

router.get('/', async (req, res) => {
    const valores = await calendar.obtenerCalendario()
    res.json(valores)
})

router.get('/cantidadactivos/:tipo', async (req,res) => {
    const valores = await calendar.cuantosActivos(req.params.tipo)
    res.json(valores)
})

router.get('/esactivo/:tipo', async (req,res) => {
    const valores = await calendar.esActivo(req.params.tipo)
    res.json(valores)
})

router.post('/inactivar', async (req,res) => {
    const p = req.body
    console.log(p)
    await calendar.inactivarCalendario(p.obra, p.calendario, p.id)
    await res.sendStatus(202)
})

router.post('/agregarcalendario', async (req, res) => {
    const p = req.body
    await calendar.agregarCalendario(p.obra, p.calendario, p.id, p.fechaInicio, p.fechaFin)
    res.sendStatus(201)
})

router.get('/retirarhoras', async (req,res) => {
    const result = await calendar.retirarHoras()
    res.json(result)
})

module.exports = router;