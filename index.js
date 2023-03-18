const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Crear el servidor
const app = express();

// Conectar a la BD
connectDB();

// Habilitar CORS
app.use(cors({ origin: '*' }));

// Habilitar express.json
app.use(express.json({ extended: true }));
// port app
const PORT = process.env.PORT || 4000;

// Importar rutas
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));

// Definir la página principal
app.get('/', (req, res) => {
  res.send('Servidor Corriendo');
});

// run app

app.listen(PORT, () => {
  console.log(`El servidor esta funcionando en el puerto ${PORT}`);
});
