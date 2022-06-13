/*
    Rutas: /api/ventas
*/

const { Router } = require('express');

const { validarJWT } = require('../middleware/validar-jwt.middleware');
const { VentaController } = require('../controllers/index.controller');

const router = Router();

/*  ================================================
    ROUTES USUARIOS
    ================================================
*/

router.get('/venta/', validarJWT, VentaController.getReservaDate);
router.get('/facturaReserva/:id', VentaController.facturaReserva);
router.get('/reporte/excelgenerate/', VentaController.excelGenerateVentas);
router.get('/reporte/total-reservas/', VentaController.getReportReservaTotal);

module.exports = router;
