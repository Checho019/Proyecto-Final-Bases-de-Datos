const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
require('ejs')

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

app.listen(3000, (err) => {
    if (err) {
        console.log('Error al arrancar el servidor' + err)
    } else {
        console.log(`Server on port ${3000}`)
    }
})
