const mongoose = require('mongoose');

const schemaBesoin = new mongoose.Schema({
	biensId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Bien'
		}
	],
	associationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Association'
	}
});

const Besoin = mongoose.model('Besoin', schemaBesoin);

exports.schemaBesoin = schemaBesoin;
exports.Besoin = Besoin;
