const mongoose = require('mongoose');

const { MONGO_URI } = require('../config/env.config');

const dbConnection = async () => {
	try {
		await mongoose.connect(MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: true,
		});
		console.log('DB connet');
	} catch (error) {
		console.log(error);

		throw new Error('Error a la hora de iniciar la Base de Datos');
	}
};

module.exports = {
	dbConnection,
};
