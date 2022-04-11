if (process.env.NODE_ENV !== 'production') {
	const dotenv = require('dotenv');
	const result = dotenv.config();
	if (result.error) {
		throw result.error;
	}
}

module.exports = {
	PORT: process.env.PORT,
	MONGO_URI: process.env.MONGO_URI,
	SECRET_KEY_JWT: process.env.SECRET_KEY_JWT,
	GOOGLE_ID: process.env.GOOGLE_ID,
	SECRET_KEY_GOOLE: process.env.SECRET_KEY_GOOLE,
};
