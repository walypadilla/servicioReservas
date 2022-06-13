const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const RanchoModel = Schema({
	usuario: { type: Schema.Types.ObjectId, ref: 'User', require: true },
	nombre: { type: String, require: true },
	direccion: { type: String, require: true },
	costo: {
		type: mongoose.Decimal128,
		set: (v) => {
			return new mongoose.Types.Decimal128(v.toFixed(4));
		},
	},
	estado: { type: Boolean, default: true },
});

module.exports = model('Rancho', RanchoModel);
