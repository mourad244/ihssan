const mongoose = require('mongoose');

const associationSchema = new mongoose.Schema({
	nom: {
		type: String,
		required: true,
		trim: true,
		maxlength: 255
	},
	images: {
		type: Array
	},
	biensId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Bien'
		}
	],
	donsId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Don'
		}
	],
	description: {
		type: String,
		trim: true,
		maxlength: 1024
	},
	adresse: {
		type: String,
		required: true
	},
	telephone: {
		type: String,
		required: true
	},
	email: {
		type: String
	},
	usersEmail: [
		{
			type: new mongoose.Schema({
				email: {
					type: String
				},
				nom: String
			})
		}
	]
});

const Association = mongoose.model('Asssociation', associationSchema);

exports.associationSchema = associationSchema;
exports.Association = Association;
