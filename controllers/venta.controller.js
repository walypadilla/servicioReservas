const PDF = require('pdfkit-construct');
const excelJS = require('exceljs');
const path = require('path');
const mime = require('mime');

const Reserva = require('../models/reserva.model');
const { dateList, dateListCalendar } = require('../helpers/dateFormat.helpers');

// GET REPORT OF THE SALE
// ========================================================================
const getReservaDate = async (req, res) => {
	try {
		// agrupar por mes o año
		const reservationDate = await Reserva.aggregate([
			{
				$group: {
					_id: {
						year: {
							$year: '$fechaInicio',
						},
						mes: {
							$month: '$fechaInicio',
						},
					},
					ventas: {
						$push: {
							total: '$monto',
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					year: '$_id.year',
					mes: '$_id.mes',
					total: {
						$reduce: {
							input: '$ventas',
							initialValue: 0,
							in: {
								$sum: ['$$value', '$$this.total'],
							},
						},
					},
				},
			},
			{
				$group: {
					_id: '$year',
					ventas: {
						$push: {
							mes: '$mes',
							total: '$total',
						},
					},
				},
			},
		]);

		res.json({
			ok: true,
			reservationDate,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error en los logs... Hable con un administrador.',
		});
	}
};

// GET REPORT OF THE SALE
const excelGenerateVentas = async (req, res) => {
	try {
		// agrupar por mes o año
		const reservationDate = await Reserva.aggregate([
			{
				$group: {
					_id: {
						year: {
							$year: '$fechaInicio',
						},
						mes: {
							$month: '$fechaInicio',
						},
					},
					ventas: {
						$push: {
							total: '$monto',
						},
					},
				},
			},
			{
				$project: {
					_id: 0,
					year: '$_id.year',
					mes: '$_id.mes',
					total: {
						$reduce: {
							input: '$ventas',
							initialValue: 0,
							in: {
								$sum: ['$$value', '$$this.total'],
							},
						},
					},
				},
			},
			{
				$group: {
					_id: '$year',
					ventas: {
						$push: {
							mes: '$mes',
							total: '$total',
						},
					},
				},
			},
		]);

		// arreglando el array
		const anios = reservationDate.map((anio) => {
			return anio.ventas.map((venta) => {
				let total = JSON.stringify(venta.total);
				let totalTem = total.substring(19, total.length - 2);
				return { anio: anio._id, mes: venta.mes, total: totalTem };
			});
		});

		const fileName = path.basename('DatosReserva.xlsx');
		const nimeType = mime.getType('DatosReserva.xlsx');

		const workbook = new excelJS.Workbook();

		const sheet = workbook.addWorksheet('DatosReserva.xlsx');

		const reColumns = [
			{ header: 'Año', key: 'anio' },
			{ header: 'mes', key: 'mes' },
			{ header: 'total', key: 'total' },
		];

		sheet.columns = reColumns;

		anios.map((elemento) => {
			return elemento.map((reg) => {
				console.log('Registro', reg);
				sheet.addRow([reg.anio, reg.mes, reg.total]);
			});
		});
		workbook.xlsx
			.writeFile('DatosReserva.xlsx')
			.then((e) => {
				console.log('Creado Exitosamente');
			})
			.catch(() => {
				console.log('Algo sucedio al guardar el archivo.');
			});

		res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
		res.setHeader('Content-Type', nimeType);

		setTimeout(() => {
			res.download('DatosReserva.xlsx');
		}, 2000);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error en los logs... Hable con un administrador.',
		});
	}
};

// GET REPORT OF THE  all RESERVATION
// // ==============================================================================================
const getReportReservaTotal = async (req, res) => {
	try {
		const reservaDB = await Reserva.find()
			.populate('rancho', 'nombre costo')
			.populate('cliente', 'name email telefono');

		// mapeando los datos para darles un mejor formato
		const reservaFiltro = reservaDB.map((reserva) => {
			// Arreglando datos de monto para generar el array
			let monto = JSON.stringify(reserva.monto);
			let montoN = monto.substring(19, monto.length - 2);
			// Arreglando datos de costo de rancho para generar el array
			let costoS = JSON.stringify(reserva.rancho.costo);
			let costoSui = costoS.substring(19, costoS.length - 2);

			return {
				cliente: reserva.cliente.name,
				email: reserva.cliente.email,
				telefono: reserva.cliente.telefono,
				fechaInicio: dateListCalendar(reserva.fechaInicio),
				fechaSalida: dateListCalendar(reserva.fechaSalida),
				nombreSuite: reserva.rancho.nombre,
				costoXSuite: costoSui,
				dias: reserva.dias,
				monto: montoN,
			};
		});
		// nombre del archivo
		const fileName = path.basename('ReporteReserva.xlsx');
		const nimeType = mime.getType('ReporteReserva.xlsx');

		const workbook = new excelJS.Workbook();

		const sheet = workbook.addWorksheet('ReporteReserva.xlsx');

		const reColumns = [
			{ header: 'Cliente', key: 'cliente' },
			{ header: 'Correo', key: 'email' },
			{ header: 'Telefono', key: 'telefono' },
			{ header: 'Fecha Inicio', key: 'fechaInicio' },
			{ header: 'Fecha Salida', key: 'fechaSalida' },
			{ header: 'Nombre Suite', key: 'nombreSuite' },
			{ header: 'Precio Suite', key: 'costoXSuite' },
			{ header: 'Dias', key: 'dias' },
			{ header: 'Total', key: 'monto' },
		];

		sheet.columns = reColumns;
		sheet.addRows(reservaFiltro);

		workbook.xlsx
			.writeFile('ReporteReserva.xlsx')
			.then((e) => {
				console.log('Creado Exitosamente');
			})
			.catch(() => {
				console.log('Algo sucedio al guardar el archivo.');
			});

		res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
		res.setHeader('Content-Type', nimeType);

		setTimeout(() => {
			res.download('ReporteReserva.xlsx');
		}, 2000);
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error en los logs... Hable con un administrador.',
		});
	}
};

// POST GENERAR FACTURA
// ===============================================================================================
const facturaReserva = async (req, res) => {
	const id = req.params.id;

	try {
		const reserva = await Reserva.findById(id)
			.populate('rancho', 'nombre costo')
			.populate('cliente', 'name');

		if (!reserva) {
			return res.status(401).json({
				ok: false,
				msg: 'La orden que intenta imprimir no existe',
			});
		}
		// GENERANDO PDF DE RECIBO =============================================
		const filename = `Factura.${Date.now()}.pdf`;

		const doc = new PDF({ bufferPages: true });

		const stream = res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Content-disposition': `attachment;filename=${filename}`,
		});

		doc.on('data', (data) => {
			stream.write(data);
		});
		doc.on('end', () => {
			stream.end();
		});

		const reservaPDF = [
			{
				Nro: 'Reservación',
				cliente: reserva.cliente.name,
				fechaInicio: reserva.fechaInicio,
				fechaSalida: reserva.fechaSalida,
				nombre: reserva.rancho.nombre,
				precio: reserva.rancho.costo,
				dias: reserva.dias,
				subtotal: reserva.monto,
			},
		];
		doc.setDocumentHeader(
			{
				height: '30%',
			},
			() => {
				doc.fontSize(24).text('RANCHO SAN JULIAN', {
					width: 420,
					align: 'center',
				});
				doc.fontSize(20).text('TICKET', {
					width: 420,
					align: 'center',
				});
				doc.fontSize(14).text(`Cliente: ${reserva.cliente.name}`, {
					width: 420,
					align: 'left',
				});
				doc
					.fontSize(14)
					.text(`Fecha llegada: ${dateList(reserva.fechaInicio)}`, {
						width: 420,
						align: 'left',
					});
				doc
					.fontSize(14)
					.text(`Fecha Sálida: ${dateList(reserva.fechaSalida)}`, {
						width: 420,
						align: 'left',
					});
				doc
					.fontSize(14)
					.text(`------------------------><------------------------`, {
						width: 420,
						align: 'center',
					});
				doc.fontSize(16).text(`Rancho San Julian`, {
					width: 500,
					height: 200,
					align: 'left',
				});
				doc.fontSize(14).text(`Dirección: Avenida los procereses`, {
					width: 420,
					align: 'left',
				});
				doc.fontSize(14).text(`Télefono:`, {
					width: 420,
					align: 'left',
				});
			}
		);

		doc.addTable(
			[
				{ key: 'Nro', label: 'Nro', align: 'left' },
				{ key: 'nombre', label: 'Descripcion', align: 'left' },
				{ key: 'precio', label: 'Precio Unit', align: 'left' },
				{ key: 'dias', label: 'Dias', align: 'left' },
				{ key: 'subtotal', label: 'Sub Total', align: 'center' },
			],
			reservaPDF,
			{
				border: null,
				width: 'fill_body',
				striped: true,
				stripedColors: ['#f6f6f6', '#d6c4dd'],
				cellsPadding: 10,
				marginLeft: 45,
				marginRight: 45,
				headAlign: 'left',
			}
		);

		// render tables
		doc.render();
		doc.end();
	} catch (error) {
		console.log(error);
		res.status(500).json({
			ok: false,
			msg: 'Error en los logs... Hable con un administrador.',
		});
	}
};

module.exports = {
	getReservaDate,
	excelGenerateVentas,
	facturaReserva,
	getReportReservaTotal,
};
