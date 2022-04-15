const express = require('express');
const cors = require('cors');

const { PORT } = require('./config/env.config');
const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

// configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// base de datos
dbConnection();

// rutas
app.use('/api/', require('./routes/index.routes'));

app.listen(PORT, () => {
	console.log('server corriendo');
});
