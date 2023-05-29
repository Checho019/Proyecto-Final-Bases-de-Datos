const estudiantes = require('../services/estudiante')
const express = require('express');

const router = express.Router();


router.get('/', async (req, res) => {
    const r = await estudiantes.obtenerEstudiantes()
    res.json(r)
})

router.post('/agregar', async (req, res) => {
    const p = req.body
    console.log(p)
    await estudiantes.EstudianteParticipa(p.cod, p.cal)
    res.sendStatus(201)
})

router.get('/participantes', async (req, res) => {
    const result = await estudiantes.participantes()
    res.json(result)
})

router.get('/llenado', async (req,res) => {
    await estudiantes.llenarTodaAsistencia()
    res.sendStatus(201)
})

module.exports = router