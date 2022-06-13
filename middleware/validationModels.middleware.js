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

// ================================================
// Validation Login Google
// ================================================
let validationLoginGoogle = [
	check('token', 'El token de google es obligatorio.').not().isEmpty(),
];

// ================================================
// Validation CREATE RANCH
// ================================================
let validationCreateRanch = [
	check('nombre', 'El nombre es es obligatorio.').not().isEmpty(),
	check('direccion', 'La dirección es obligatoria.').not().isEmpty(),
	check('costo', 'El costo es obligatorio.').not().isEmpty().isFloat(),
];

// ================================================
// Validation CREATE RESERVA
// ================================================
let validationCreateReserva = [
	check('fechaInicio', 'La fecha de su reserva es requerida.').trim().isDate(),
	check('fechaSalida', 'La fecha fin de su reserva es requerida.')
		.not()
		.isEmpty()
		.isDate(),
	check('rancho', 'El Rancho ID debe de ser válido.').isMongoId(),
];

module.exports = {
	validationUserModel,
	validationUpdateUser,
	validationLogin,
	validationLoginGoogle,
	validationCreateRanch,
	validationCreateReserva,
};
