/*
    Rutas: /api/search
*/
const { Router } = require('express');

const { validarJWT } = require('../middleware/validar-jwt.middleware');
const { SearchController } = require('../controllers/index.controller');

const router = Router();

router.get(
	'/coleccion/:tabla/:busqueda',
	validarJWT,
	SearchController.searchCategory
);
router.get('/reservas', validarJWT, SearchController.searchReserva);

module.exports = router;
