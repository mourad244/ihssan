const mongoose = require('mongoose');

const donnateurSchema = new mongoose.Schema({
	nom: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 50
	},
	email: {
		type: String,
		minlength: 5,
		maxlength: 50
	},

	telephone: {
		type: String
	},
	donsId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Don'
		}
	]
});
const Donnateur = mongoose.model('Donnateur', donnateurSchema);
// donnateurSchema.index({ email: 1 }, { unique: true, sparse: true });

exports.donnateurSchema = donnateurSchema;
exports.Donnateur = Donnateur;
