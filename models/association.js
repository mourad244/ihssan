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
	besoinsId: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Besoin'
		}
	],
	description: {
		type: Array
	},
	telephone: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024
	}
});
userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign(
		{
			_id: this._id,
			nom: this.nom,
			email: this.email
		},
		config.get('jwtPrivateKey')
	);
	return token;
};

const Association = mongoose.model('Asssociation', associationSchema);

exports.associationSchema = associationSchema;
exports.Association = Association;
