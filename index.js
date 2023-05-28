// Librerias
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
require('ejs')

// Controlladores
const calendarRoutes = require('./routes/calendarioController')

// Servicios
const docentes = require('./services/docente')
const estudiantes = require('./services/estudiante')

const port = process.env.PORT || 3000
const app = express()
const u = {
    nombre: 'juan',
    apellido: 'xd'
}
app.set('user',u)

// config
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware
app.use( async (req, res, next) => {
    return next();
    if (!app.get('auth')) {
        if (req.method === 'POST') {
            const user = await docentes(req.body.email, req.body.password);
            console.log(user)
            if (user.length > 0) {
                app.set('auth', true)
                app.set('user', user)
                return res.redirect('/')
            } else {
                return res.render('login')
            }
        } else {
            return res.render('login')
        }
    }
    next()
})

// Routes
app.use('/calendario', calendarRoutes);

app.get('/', (req, res) => {
    res.render('index', app.get('user').nombre )
})

app.get('/estudiantes', async (req, res) => {
    const r = await estudiantes.obtenerEstudiantes()
    res.json(r)
})

app.listen(port, (err) => {
    if (err) {
        console.log('Error al arrancar el servidor' + err)
    } else {
        console.log(`Server on port ${3000}`)
    }
})
