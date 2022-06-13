const Rancho = require('../models/rancho.model');

/*  ================================================
    GET RACH CONTROLLER
    ================================================
*/
const getRanch = async (req, res) => {
	try {
		const ranchos = await Rancho.find().populate('usuario', 'name');

		res.json({
			ok: true,
			ranchos,
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
    CREATE RACH CONTROLLER
    ================================================
*/
const createRanch = async (req, res) => {
	const uid = req.uid;
	// obteniendo el codigo del usuario y el req del nuevo rancho
	const rancho = new Rancho({ usuario: uid, ...req.body });
	console.log(uid);

	try {
		//  guardando rancho nuevo
		const ranchoDB = await rancho.save();

		res.json({
			ok: true,
			rancho: ranchoDB,
		});
	} catch (error) {
		res.satus(500).json({
			ok: false,
			msg: 'Error inesperado... Hablar con el administrador.',
		});
	}
};

/*  ================================================
    UPDATE RACH CONTROLLER
    ================================================
*/
const updateRanch = async (req, res) => {
	const uid = req.params.id;

	try {
		// verificar si existe rancho con ese ID
		const ranchoDB = await Rancho.findById(uid);

		if (!ranchoDB) {
			return res.status(404).json({
				ok: false,
				msg: 'El Rancho que intenta modificar no existe en la Base de Datos.',
			});
		}

		// actualizacion
		const campos = req.body;

		const ranchoActualizado = await Rancho.findByIdAndUpdate(uid, campos, {
			new: true,
		});

		res.json({
			ok: true,
			rancho: ranchoActualizado,
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
    DELETE RACH CONTROLLER
    ================================================
*/
const deleteRanch = async (req, res) => {
	const uid = req.params.id;

	try {
		// buscando el rancho por el ID
		const ranchDB = await Rancho.findById(uid);

		if (!ranchDB) {
			res.status(401).json({
				ok: false,
				msg: 'El Rancho que intenta eliminar no existe.',
			});
		}

		// cambiando estado a false
		ranchDB.estado = false;

		const ranchoDeleted = await Rancho.findByIdAndUpdate(uid, ranchDB, {
			new: true,
		});

		res.json({
			ok: true,
			msg: 'Rancho eliminado correctamente.',
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
	createRanch,
	deleteRanch,
	updateRanch,
	getRanch,
};
