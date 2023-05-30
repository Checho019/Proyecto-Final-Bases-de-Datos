// Librerias
const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer')
require('ejs')

// Controlladores
const calendarRoutes = require('./routes/calendarioController')
const instrumentoRoutes = require('./routes/instrumentoController')
const estudianteRoutes = require('./routes/estudianteController')

// Servicios
const docentes = require('./services/docente')
const mailSender = require('./services/mailSender')

const port = process.env.PORT || 3000
const app = express()
const u = {
    nombre: 'Sergio',
    apellido: 'Duarte'
}
app.set('user', u)

// config
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

// Middleware de autenticacion
app.use(async (req, res, next) => {
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
    res.render('index', { nombre: app.get('user').nombre + ' ' + app.get('user').apellido })
})

// Generador de pdf
app.post('/pdf', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        await page.setContent(req.body.html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });
    
        await browser.close();
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="archivo.pdf"');
        res.send(pdfBuffer);
      } catch (error) {
        console.error('Error al generar el PDF:', error);
        res.status(500).send('Error al generar el PDF');
      }
})

// Envio de correos
app.post('/email', (req,res) => {
    mailSender.sendEmail(req.body.estudiantes)
    res.sendStatus(202)
})

// Servidor
app.listen(port, (err) => {
    if (err) {
        console.log('Error al arrancar el servidor' + err)
    } else {
        console.log(`Server on port ${3000}`)
    }
})
