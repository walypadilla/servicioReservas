const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const { updatePhoto } = require('../helpers/updatePhoto.helpers');

/*  ================================================
    UPLOADS IMAGE
    ================================================
*/
const fileUpload = (req, res) => {
	const id = req.params.id;

	try {
		// validando que exista un archivo
		if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).json({ ok: false, msg: 'No hay ningún archivo.' });
		}

		// procesar la imagen
		const file = req.files.imagen;

		const nombreCortado = file.name.split('.');
		const extensionArchivo = nombreCortado[nombreCortado.length - 1];

		// validando extension
		const extensionesValidas = ['png', 'jpg', 'jpef', 'gif'];
		if (!extensionesValidas.includes(extensionArchivo)) {
			return res.status(400).json({
				ok: false,
				msg: 'No es una extensión válida.',
			});
		}

		// Generar el nombre del archivo
		const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

		// Path para guardar la imagen
		const path = `./uploads/users/${nombreArchivo}`;

		// Use the mv() mover la imagen
		file.mv(path, (err) => {
			if (err) {
				console.log(err);
				return res.status(500).json({
					ok: false,
					msg: 'Error al mover la imagen.',
				});
			}
		});

		// actualizar la base de datos
		updatePhoto(id, nombreArchivo);

		res.json({
			ok: true,
			msg: 'Archivo subido.',
			nombreArchivo,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error logico... Hablar con el adminitrador.',
		});
	}
};

/*  ================================================
    GET IMAGE
    ================================================
*/
const getImage = (req, res) => {
	const photo = req.params.photo;

	try {
		// path donde se guardara la imagen
		const pathImg = path.join(__dirname, `../uploads/users/${photo}`);

		// verificar si la imagen ya existe la eliminamos
		if (fs.existsSync(pathImg)) {
			res.sendFile(pathImg);
		} else {
			const pathImg = path.join(__dirname, `../uploads/no-image.png`);
			res.sendFile(pathImg);
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error logico... Hablar con el adminitrador.',
		});
	}
};

module.exports = {
	fileUpload,
	getImage,
};
