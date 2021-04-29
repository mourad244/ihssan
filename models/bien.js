const mongoose = require('mongoose');

const bienSchema = new mongoose.Schema({
	nom: {
		type: String,
		required: true
	},
	images: {
		type: Array
	}
});
const Bien = mongoose.model('Bien', bienSchema);

exports.Bien = Bien;
