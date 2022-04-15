const express = require('express');

const app = express();

const UserRoutes = require('./user.routes');
const AuthRoutes = require('./auth.routes');

app.use('/usuarios', UserRoutes);
app.use('/login', AuthRoutes);

module.exports = app;
