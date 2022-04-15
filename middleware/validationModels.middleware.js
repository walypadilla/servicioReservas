const { check } = require('express-validator');

// ================================================
// Validation fields the User Model Required
// ================================================
let validationUserModel = [
	check('name', 'El nombre es es obligatorio.').not().isEmpty(),
	check('lastName', 'El apellido es obligatorio.').not().isEmpty(),
	check('email', 'El email es obligatorio.').isEmail(),
	check('telefono', 'Este campo solo acepta números')
		.isNumeric()
		.isLength({ min: 1, max: 8 }),
	check('password', 'El password es obligatorio.')
		.not()
		.isEmail()
		.isLength({ min: 5 }),
];

// ================================================
// Validation fields the User Model Required
// ================================================
let validationUpdateUser = [
	check('name', 'El nombre es es obligatorio.').not().isEmpty(),
	check('lastName', 'El apellido es obligatorio.').not().isEmpty(),
	check('email', 'El email es obligatorio.').isEmail(),
	check('telefono', 'Este campo solo acepta números')
		.isNumeric()
		.isLength({ min: 1, max: 8 }),
];

// ================================================
// Validation Login
// ================================================
let validationLogin = [
	check('email', 'El email es obligatorio.').isEmail(),
	check('password', 'El password es obligatorio.')
		.not()
		.isEmail()
		.isLength({ min: 5 }),
];

module.exports = {
	validationUserModel,
	validationUpdateUser,
	validationLogin,
};
