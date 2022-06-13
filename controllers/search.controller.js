const User = require('../models/user.model');
const Reserva = require('../models/reserva.model');
const Rancho = require('../models/rancho.model');

/*  ================================================
    GET SEARCH FOR CATEGORY
    ================================================
*/
const searchCategory = async (req, res) => {
	const tabla = req.params.tabla;
	const busqueda = req.params.busqueda;
	const regex = new RegExp(busqueda, 'i');
	let data = [];

	// buscando segun lo que se eliga
	switch (tabla) {
		case 'user':
			// buscando usuarios segun el nombre
			data = await User.find({ nombre: regex, estado: true });

			break;
		case 'ranch':
			// buscando usuarios segun el nombre
			data = await Rancho.find({ nombre: regex, estado: true }).populate(
				'usuario',
				'name correo'
			);
			break;

		default:
			return res.status(400).json({
				ok: false,
				msg: 'El elemento que intenta buscar no es válido.',
			});
	}

	res.json({
		ok: true,
		resultado: data,
	});
};

/*  ================================================
    GET SEARCH RESERVA
    ================================================
*/
const searchReserva = async (req, res) => {
	const fechaBusqueda = req.body.fechaBusqueda;
	try {
		const reservaFecha = await Reserva.find({
			fechaInicio: { $gte: fechaBusqueda },
		}).limit(5);
		console.log(reservaFecha);
		if (!reservaFecha) {
			return res.status(400).json({
				ok: false,
				msg: 'No existe reservas en el rango seleccionado.',
			});
		}

		res.json({
			ok: true,
			data: reservaFecha,
		});
	} catch (error) {}
};

module.exports = {
	searchCategory,
	searchReserva,
};
