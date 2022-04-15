const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const { generarJWT } = require('../helpers/jwt.helpers');

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
		const token = await generarJWT(usuarioDB.id);

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

module.exports = {
	login,
};
