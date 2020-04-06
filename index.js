const express = require('express');
const conectarDB = require('./config/db');

// crear el servidor
const app = express();

// Conectar a la base de datos
conectarDB();

// Habilitar express.json
app.use(express.json({ extended: true }));

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/proyectos/tareas', require('./routes/tareas'));

// Puerto de la app
// El cliente esta en el servidor 3000, el serividor en el 4000
const PORT = process.env.PORT || 4000; // Heroku va a buscar esa variable de entorno

// Definir la pagina principal
app.get('/', (req, res) => {
    res.send('Hola mundo');
});


// arrancar la app
app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});


