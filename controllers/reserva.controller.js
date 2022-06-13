const Reserva = require('../models/reserva.model');
const Rancho = require('../models/rancho.model');

/*  ================================================
    GET RESERVA CONTROLLER
    ================================================
*/
const getReserva = async (req, res) => {
	const desde = Number(req.query.desde) || 0;

	try {
		// Ejecutando ambos procesos al mismo tiempo
		const [reservas, total] = await Promise.all([
			Reserva.find()
				.populate('rancho', 'nombre costo')
				.populate('cliente', 'name')
				.skip(desde)
				.limit(10),

			Reserva.count(),
		]);

		res.json({
			ok: true,
			reservas,
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
    GET FOR USER CONTROLLER
    ================================================
*/
const getReservaUser = async (req, res) => {
	const uid = req.uid;

	try {
		// Buscar reservas por ID =======================================================================
		const reservationUser = await Reserva.find({ cliente: uid });

		// MOSTRANDO RESERVAS POR USUARIO
		res.json({
			ok: true,
			reservationUser,
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
    CREATE RESERVA CONTROLLER
    ================================================
*/
const createReserva = async (req, res) => {
	const uid = req.uid;
	const reservationData = req.body;
	const ranchoId = reservationData.rancho;
	let dias = 0;
	let diaIni = new Date(reservationData.fechaInicio);
	let diaFi = new Date(reservationData.fechaSalida);

	try {
		// accediendo al rancho
		const rancho = await Rancho.findById(ranchoId);

		const { costo } = rancho; // costo del rancho
		let monto; // monto que llevara la reserva

		if (!rancho) {
			res.status(404).json({
				ok: false,
				msg: 'Rancho no encontrado.',
			});
		}

		// Calculando los dias de diferencia.
		const diasMillisegundos = 86400000;
		let diffMillisegundos = diaFi - diaIni;
		dias = diffMillisegundos / diasMillisegundos; // calculando los dias en numeros enteros
		monto = dias * Number(costo); // calculando monto de la reserva

		// convertir fecha actual a formato YYYY/MM/DD
		const formatYmd = (date) => date.toISOString().slice(0, 10);

		// validar si fecha de reserva no es menor a la actual =========================================
		if (
			reservationData.fechaInicio <= formatYmd(new Date()) ||
			reservationData.fechaSalida <= formatYmd(new Date())
		) {
			return res.status(404).json({
				ok: false,
				msg: 'La fecha inicio no puede ser menor a la actual.',
			});
		} else if (
			reservationData.fechaSalida < reservationData.fechaInicio ||
			reservationData.fechaSalida === reservationData.fechaInicio
		) {
			return res.status(404).json({
				ok: false,
				msg: 'La fecha de Salida tiene que ser mayor a la de llegada.',
			});
		}

		// Verificando si las fechas de las reservas no estan ocipadas =========================
		// ==============================================================
		// aqui verifico que la fecha de inicio de la nueva reserva no sea mayor a una de inicio guardada ni mayor a una de salida
		const reservationCollition = await Reserva.findOne({
			rancho: ranchoId,
			$or: [
				{
					fechaInicio: {
						$gte: reservationData.fechaInicio,
						$lt: reservationData.fechaSalida,
					},
				},
				{
					fechaSalida: {
						$gte: reservationData.fechaInicio,
						$lte: reservationData.fechaSalida,
					},
				},
			],
		});

		if (reservationCollition) {
			return res.status(400).json({
				ok: false,
				msg: 'La fecha que intenta reservar ya no esta disponible.',
			});
		}

		// CREANDO RESERVAS =====================================================
		const reserva = new Reserva({
			cliente: uid,
			fechaInicio: reservationData.fechaInicio,
			fechaSalida: reservationData.fechaSalida,
			dias: dias,
			monto: monto,
			rancho: ranchoId,
		});
		// guardando reservas ==================================================
		const reservaDB = await reserva.save();
		res.json({
			ok: true,
			reservaDB,
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
    UPDATE RESERVA CONTROLLER
    ================================================
*/
const updateReserva = async (req, res) => {
	const uid = req.params.id;
	const reservationData = req.body;
	const ranchoId = reservationData.rancho;
	let dias = 0;
	let diaIni = new Date(reservationData.fechaInicio);
	let diaFi = new Date(reservationData.fechaSalida);

	try {
		// accediendo al rancho
		const rancho = await Rancho.findById(ranchoId);

		// Costo del rancho ==========================================================
		const { costo } = rancho; // costo del rancho
		let monto; // monto que llevara la reserva

		if (!rancho) {
			res.status(404).json({
				ok: false,
				msg: 'Rancho no encontrado.',
			});
		}

		// verificar si existe reserva con ese id
		reservaDB = await Reserva.findById(uid);
		if (!reservaDB) {
			res.status(402).json({
				ok: false,
				msg: 'No existe reserva con ese ID.',
			});
		}

		delete reservaDB.fechaInicio;
		delete reservaDB.fechaSalida;

		// Calculando los dias de diferencia.
		const diasMillisegundos = 86400000;
		let diffMillisegundos = diaFi - diaIni;
		dias = diffMillisegundos / diasMillisegundos; // calculando los dias en numeros enteros
		monto = dias * Number(costo); // calculando monto de la reserva

		// convertir fecha actual a formato YYYY/MM/DD
		const formatYmd = (date) => date.toISOString().slice(0, 10);

		// validar si fecha de reserva no es menor a la actual =========================================
		if (
			reservationData.fechaInicio <= formatYmd(new Date()) ||
			reservationData.fechaSalida <= formatYmd(new Date())
		) {
			return res.status(404).json({
				ok: false,
				msg: 'La fecha inicio no puede ser menor a la actual.',
			});
		} else if (
			reservationData.fechaSalida < reservationData.fechaInicio ||
			reservationData.fechaSalida === reservationData.fechaInicio
		) {
			return res.status(404).json({
				ok: false,
				msg: 'La fecha de Salida tiene que ser mayor a la de llegada.',
			});
		}

		// Verificando si las fechas de las reservas no estan ocipadas =========================
		// ==============================================================
		// aqui verifico que la fecha de inicio de la nueva reserva no sea mayor a una de inicio guardada ni mayor a una de salida
		const reservationCollition = await Reserva.findOne({
			rancho: ranchoId,
			$or: [
				{
					fechaInicio: {
						$gte: reservationData.fechaInicio,
						$lt: reservationData.fechaSalida,
					},
				},
				{
					fechaSalida: {
						$gte: reservationData.fechaInicio,
						$lte: reservationData.fechaSalida,
					},
				},
			],
		});

		if (reservationCollition) {
			return res.status(400).json({
				ok: false,
				msg: 'La fecha que intenta reservar ya no esta disponible.',
			});
		}

		reservaDB = {
			fechaInicio: reservationData.fechaInicio,
			fechaSalida: reservationData.fechaSalida,
			dias: dias,
			monto: monto,
			rancho: ranchoId,
		};

		const reservaUpdated = await Reserva.findByIdAndUpdate(uid, reservaDB, {
			new: true,
		});

		// ======================================================
		res.json({
			ok: true,
			reserva: reservaUpdated,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... Hable con el administrador.',
		});
	}
};

/*  ================================================
    DELETE RESERVA CONTROLLER
    ================================================
*/
const deleteteReserva = async (req, res) => {
	const uid = req.params.id;

	try {
		// revisar si existe en la DB la reserva
		const reservaDB = await Reserva.findById(uid);

		// Avisar que no esta
		if (!reservaDB) {
			res.status(402).json({
				ok: false,
				msg: 'No existe reserva con ese ID',
			});
		}

		await Reserva.findByIdAndDelete(uid);

		res.json({
			ok: true,
			msg: 'Reserva eliminada correctamente.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error inesperado... Hable con el administrador.',
		});
	}
};

module.exports = {
	getReserva,
	getReservaUser,
	createReserva,
	updateReserva,
	deleteteReserva,
};
