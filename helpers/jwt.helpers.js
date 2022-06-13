const jwt = require('jsonwebtoken');
const { SECRET_KEY_JWT } = require('../config/env.config');

/*  ================================================
    JWT GENERAR
    ================================================
*/
const generarJWT = (uid, nombre) => {
	return new Promise((resolve, reject) => {
		const payload = {
			uid,
			nombre,
		};
		jwt.sign(
			payload,
			SECRET_KEY_JWT,
			{
				expiresIn: '12h',
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject('No se pudo generar el JWT.');
				} else {
					resolve(token);
				}
			}
		);
	});
};

module.exports = {
	generarJWT,
};
