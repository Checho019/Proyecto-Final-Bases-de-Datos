// Librerias
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
require('ejs')

// Controlladores
const calendarRoutes = require('./routes/calendarioController')
const instrumentoRoutes = require('./routes/instrumentoController')
const estudianteRoutes = require('./routes/estudianteController')

// Servicios
const docentes = require('./services/docente')

const port = process.env.PORT || 3000
const app = express()
const u = {
    nombre: 'Sergio',
    apellido: 'Duarte'
}
app.set('user',u)

// config
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware de autenticacion
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

// Calendario Routes
app.use('/calendario', calendarRoutes);

// Instrumento Routes
app.use('/instrumento', instrumentoRoutes)

// 
app.use('/estudiante', estudianteRoutes)

// Index
app.get('/', (req, res) => {
    res.render('index',{nombre:app.get('user').nombre + ' ' + app.get('user').apellido})
})

// Servidor
app.listen(port, (err) => {
    if (err) {
        console.log('Error al arrancar el servidor' + err)
    } else {
        console.log(`Server on port ${3000}`)
    }
})
