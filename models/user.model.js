const { Schema, model } = require('mongoose');

const UserModel = Schema({
	name: { type: String, require: true },
	lastName: { type: String, require: true },
	telefono: { type: Number },
	email: { type: String, require: true, unique: true },
	password: { type: String, require: true },
	google: { type: Boolean, default: false },
	estado: { type: Boolean, default: true },
	role: { type: String, require: true, default: 'USER_ROLE' },
});

UserModel.method('toJSON', function () {
	const { password, ...object } = this.toObject();

	return object;
});

module.exports = model('User', UserModel);
