/*
    Rutas: /api/reservas
*/

const { Router } = require('express');

const { ReservaController } = require('../controllers/index.controller');
const { validarJWT } = require('../middleware/validar-jwt.middleware');
const {
	validationCreateReserva,
} = require('../middleware/validationModels.middleware');
const { validarCampos } = require('../middleware/fieldsValidation.middleware');

const router = Router();

router.get('/', validarJWT, ReservaController.getReserva);
router.get('/:id', validarJWT, ReservaController.getReservaUser);
router.post(
	'/',
	[validarJWT, validationCreateReserva, validarCampos],
	ReservaController.createReserva
);
router.put(
	'/:id',
	[validarJWT, validationCreateReserva, validarCampos],
	ReservaController.updateReserva
);
router.delete('/:id', validarJWT, ReservaController.deleteteReserva);

module.exports = router;
