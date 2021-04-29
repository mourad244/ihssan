const mongoose = require('mongoose');

const schemaBesoin = new mongoose.Schema({
	bienId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Bien',
		required: true
	},
	associationId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Association',
		required: true
	},
	satisfied: {
		type: Boolean,
		required: true
	}
});

schemaBesoin.statics.lookup = function (bienId, associationId) {
	return this.findOne({
		bienId: bienId,
		associationId: associationId
	});
};

const Besoin = mongoose.model('Besoin', schemaBesoin);

exports.schemaBesoin = schemaBesoin;
exports.Besoin = Besoin;
