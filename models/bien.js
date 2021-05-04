const mongoose = require('mongoose');

const bienSchema = new mongoose.Schema({
	nom: {
		type: String,
		required: true
	},
	images: {
		type: Array
	},
	associationsId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Association'
		}
	]
});
const Bien = mongoose.model('Bien', bienSchema);

exports.bienSchema = bienSchema;
exports.Bien = Bien;
