const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
require('ejs')

// Traer servicios
const calendar = require('./services/calendario')

const app = express()

// Usuario Cordinador general
const cordinador = {
    email:'admin@gmail.com',
    password:'1234',
    name: 'John Doe'
}


// config
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware
app.use((req, res, next) => {
    return next()
    if (!app.get('auth')) {
        if (req.method === 'POST'){
            if (req.body.email == cordinador.email && req.body.password == cordinador.password){
                app.set('auth',true)
                return res.redirect('/')
            }
        } else {
            return res.render('login')
        }
    }
    next()
})

// Routes
app.get('/', (req, res) => {
    res.render('index',{name:cordinador.name})
})

app.get('/calendarios', async (req, res) => {
    const valores = await calendar.obtenerCalendario()
    res.json(valores)
})

app.get('/cantidadactivos/:tipo', async (req,res) => {
    const valores = await calendar.cuantosActivos(req.params.tipo)
    res.json(valores)
})

app.get('/esactivo/:tipo', async (req,res) => {
    const valores = await calendar.esActivo(req.params.tipo)
    res.json(valores)
})

app.get('/inactivar/:obra/:calendario/:id', async (req,res) => {
    const p = req.params
    const valores = await calendar.inactivarCalendario(p.obra, p.calendario, p.id)
    res.send('Todo ok')
})

app.listen(3000, (err) => {
    if (err) {
        console.log('Error al arrancar el servidor' + err)
    } else {
        console.log(`Server on port ${3000}`)
    }
})
