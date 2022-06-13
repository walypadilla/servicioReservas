const fs = require('fs');
const User = require('../models/user.model');

const updatePhoto = async (id, nombreArchivo) => {
	const user = await User.findById(id);

	if (!user) {
		return false;
	}

	const pathViejo = `./uploads/users/${user.img}`;

	if (fs.existsSync(pathViejo)) {
		// borrar la imagen anterior
		fs.unlinkSync(pathViejo);
	}

	user.img = nombreArchivo;
	await user.save();
	return true;
};

module.exports = {
	updatePhoto,
};
