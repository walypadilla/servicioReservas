const { Schema, mongoose, model } = require('mongoose');

const ReservaModel = Schema({
	cliente: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		require: true,
	},
	fechaInicio: { type: Date, require: true },
	fechaSalida: { type: Date, require: true },
	dias: { type: Number },
	monto: {
		type: mongoose.Decimal128,
		set: (v) => {
			return new mongoose.Types.Decimal128(v.toFixed(4));
		},
	},
	rancho: {
		type: Schema.Types.ObjectId,
		ref: 'Rancho',
		require: true,
	},
});

module.exports = model('Reserva', ReservaModel);
