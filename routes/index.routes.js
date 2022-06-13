const express = require('express');

const app = express();

const UserRoutes = require('./user.routes');
const AuthRoutes = require('./auth.routes');
const RanchRoutes = require('./ranch.routes');
const ReservaRoutes = require('./reserva.routes');
const VentasRoutes = require('./ventas.routes');
const SearchRoutes = require('./search.routes');
const UploadRoutes = require('./uploads.routes');

app.use('/usuarios', UserRoutes);
app.use('/login', AuthRoutes);
app.use('/ranchos', RanchRoutes);
app.use('/reservas', ReservaRoutes);
app.use('/ventas', VentasRoutes);
app.use('/search', SearchRoutes);
app.use('/uploads', UploadRoutes);

module.exports = app;
