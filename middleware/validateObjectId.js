const mongoose = require('mongoose');

module.exports = function (req, res, next) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id || req.params.associationId || req.params.bienId))
		return res.status(404).send('Invalid ID.');

	next();
};
