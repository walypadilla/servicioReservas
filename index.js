const express = require('express');
const cors = require('cors');

const { PORT } = require('./config/env.config');
const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

// configurar CORS
app.use(cors());

// base de datos
dbConnection();

// rutas

app.listen(PORT, () => {
	console.log('server corriendo');
});
