const jwt = require('jsonwebtoken');

const { SECRET_KEY_JWT } = require('../config/env.config');

/*  ================================================
    TOKEN VALIDATION
    ================================================
*/
const validarJWT = (req, res, next) => {
	// leer token
	const token = req.header('x-token');

	if (!token) {
		return res.status(401).json({
			ok: false,
			msg: 'No hay token en la petición.',
		});
	}

	try {
		const { uid } = jwt.verify(token, SECRET_KEY_JWT);

		req.uid = uid;
		next();
	} catch (error) {
		return res.status(401).json({
			ok: false,
			msg: 'Token no válido.',
		});
	}
};

module.exports = {
	validarJWT,
};
