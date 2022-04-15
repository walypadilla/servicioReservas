/*
    Rutas: /api/usuarios
*/

const { Router } = require('express');
const { UserController } = require('../controllers/index.controller');
const {
	validationUserModel,
	validationUpdateUser,
} = require('../middleware/validationModels.middleware');
const { validarCampos } = require('../middleware/fieldsValidation.middleware');
const { validarJWT } = require('../middleware/validar-jwt.middleware');

const router = Router();

/*  ================================================
    ROUTES USUARIOS
    ================================================
*/
router.get('/', [validarJWT], UserController.getUsers);
router.post(
	'/',
	[validationUserModel, validarCampos],
	UserController.createUser
);
router.put(
	'/:id',
	[validarJWT, validationUpdateUser, validarCampos],
	UserController.updateUser
);
router.patch('/:id', validarJWT, UserController.deleteUser);
router.patch('/eliminado/:id', validarJWT, UserController.restoreUser);

module.exports = router;
