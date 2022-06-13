const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generarJWT } = require('../helpers/jwt.helpers');
const { googleVerify } = require('../helpers/google-verify.helpers');

/*  ================================================
    LOGIN USER
    ================================================
*/
const login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const usuarioDB = await User.findOne({ email });

		// verificar email
		if (!usuarioDB) {
			return res.status(404).json({
				ok: false,
				msg: 'El email o el password no son válidos.',
			});
		}

		// Verificar contraseña
		const validPassword = bcrypt.compareSync(password, usuarioDB.password);
		if (!validPassword) {
			return res.status(400).json({
				ok: false,
				msg: 'El email o el password no son válidos.',
			});
		}

		// Generar JWT
		const token = await generarJWT(usuarioDB.id, usuarioDB.name);

		res.json({
			ok: true,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado, hable con el administrador.',
		});
	}
};

/*  ================================================
    LOGIN USER ** GOOGLE
    ================================================
*/
const googleSignIn = async (req, res) => {
	const googleToken = req.body.token;

	try {
		const { given_name, family_name, email, picture } = await googleVerify(
			googleToken
		);

		// verificar si el correo ya existe
		const usuarioDB = await User.findOne({ email });
		if (!usuarioDB) {
			// si no existe el usuario
			usuario = new User({
				name: given_name,
				lastName: family_name,
				email,
				password: '@@@',
				img: picture,
				google: true,
			});
		} else {
			// existe usuario
			usuario = usuarioDB;
			usuario.google = true;
		}

		// Guardar en DB
		await usuario.save();

		// Generar JWT
		const token = await generarJWT(usuario.id, usuario.name);

		res.json({
			ok: true,
			token,
		});
	} catch (error) {
		console.log(error);
		res.status(401).json({
			ok: false,
			msg: 'Token no es correcto',
		});
	}
};
module.exports = {
	login,
	googleSignIn,
};
