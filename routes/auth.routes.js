/*
    Rutas: /api/login
*/
const { Router } = require('express');
const { AuthController } = require('../controllers/index.controller');
const { validarCampos } = require('../middleware/fieldsValidation.middleware');
const {
	validationLogin,
} = require('../middleware/validationModels.middleware');

const router = Router();

router.post('/', [validationLogin, validarCampos], AuthController.login);

module.exports = router;
