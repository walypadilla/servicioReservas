const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generarJWT } = require('../helpers/jwt.helpers');

/*  ================================================
    GET USER CONTROLLER
    ================================================
*/
const getUsers = async (req, res) => {
	const desde = Number(req.query.desde) || 0;

	try {
		// ejecutando los dos procesos en simultaneo
		const [user, total] = await Promise.all([
			User.find(
				{ estado: true },
				'name lastName email telefono role google img'
			)
				.skip(desde)
				.limit(10),

			User.countDocuments(),
		]);

		res.json({
			ok: true,
			user,
			total,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error en los logs... Hable con un administrador.',
		});
	}
};

/*  ================================================
    CREATE USER CONTROLLER
    ================================================
*/
const createUser = async (req, res) => {
	const { name, lastName, email, password, telefono } = req.body;

	try {
		// verificando si existe el correo
		const exitsEmail = await User.findOne({ email });
		if (exitsEmail) {
			return res.status(400).json({
				ok: false,
				msg: 'El correo ya esta registrado.',
			});
		}

		// creando un nuevo usuario
		const user = new User(req.body);

		//encriptando contraseña
		const salt = bcrypt.genSaltSync();
		user.password = bcrypt.hashSync(password, salt);

		// user saving
		await user.save();

		// Generar JWT
		const token = await generarJWT(user.id);

		res.json({
			ok: true,
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... Revisar logs',
		});
	}
};

/*  ================================================
    UPDATE USER CONTROLLER
    ================================================
*/
const updateUser = async (req, res) => {
	const uid = req.params.id;

	// TODO: Validar token y comprobar si es el usuario correcto
	try {
		const usuarioDB = await User.findById(uid);

		if (!usuarioDB) {
			return res.status(402).json({
				ok: false,
				msg: 'No existe un usuario por ese ID.',
			});
		}

		const { password, google, email, ...campos } = req.body;

		if (usuarioDB.email != email) {
			const exitsEmail = await User.findOne({ email });

			if (exitsEmail) {
				return res.status(400).json({
					ok: false,
					msg: 'Ya existe un usuario con ese Email.',
				});
			}
		}
		campos.email = email;

		const userUpdate = await User.findByIdAndUpdate(uid, campos, { new: true });

		res.json({
			ok: true,
			usuario: userUpdate,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... Revisar los logs.',
		});
	}
};

/*  ================================================
    DELETE USER CONTROLLER
    ================================================
*/
const deleteUser = async (req, res) => {
	const uid = req.params.id;

	try {
		const usuarioDB = await User.findById(uid);
		// validando si el usuario existe
		if (!usuarioDB) {
			res.status(402).json({
				ok: false,
				msg: 'No existe un usuario por ese id.',
			});
		}
		// cambiando estado a false
		usuarioDB.estado = false;

		const userDeleted = await User.findByIdAndUpdate(uid, usuarioDB, {
			new: true,
		});

		res.json({
			ok: true,
			msg: 'Usuario eliminado correctamente.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... Revisar los logs.',
		});
	}
};

/*  ================================================
    RESTORE USER CONTROLLER
    ================================================
*/
const restoreUser = async (req, res) => {
	const uid = req.params.id;

	try {
		const usuarioDB = await User.findById(uid);
		// validando si el usuario existe
		if (!usuarioDB) {
			res.status(402).json({
				ok: false,
				msg: 'No existe un usuario por ese id.',
			});
		}

		// cambiando estado a false
		usuarioDB.estado = true;

		const userDeleted = await User.findByIdAndUpdate(uid, usuarioDB, {
			new: true,
		});

		res.json({
			ok: true,
			msg: 'Usuario restaurado correctamente.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... Revisar los logs.',
		});
	}
};

module.exports = {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	restoreUser,
};
