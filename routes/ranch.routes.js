/*
    Rutas: /api/reservas
*/

const { Router } = require('express');

const { RanchController } = require('../controllers/index.controller');
const { validarJWT } = require('../middleware/validar-jwt.middleware');
const {
	validationCreateRanch,
} = require('../middleware/validationModels.middleware');
const { validarCampos } = require('../middleware/fieldsValidation.middleware');

const router = Router();

router.get('/', validarJWT, RanchController.getRanch);
router.post(
	'/',
	[validarJWT, validationCreateRanch, validarCampos],
	RanchController.createRanch
);
router.put(
	'/:id',
	[validarJWT, validationCreateRanch],
	RanchController.updateRanch
);
router.patch('/:id', validarJWT, RanchController.deleteRanch);

module.exports = router;
