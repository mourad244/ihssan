const Joi = require('joi');

module.exports = {
	association: (association) => {
		const schema = Joi.object({
			nom: Joi.string().min(3).max(255).required(),
			images: Joi.array(),
			biensId: Joi.array().items(Joi.objectId()),
			description: Joi.string().max(1024).allow(''),
			adresse: Joi.string().max(255).required(),
			telephone: Joi.string().min(3).max(50).required(),
			email: Joi.string().min(5).max(50).email(),
			usersEmail: Joi.array().items(Joi.string().min(5).max(50).email())
		});
		return schema.validate(association);
	},
	besoin: (besoin) => {
		const schema = Joi.object({
			biensId: Joi.array().items(Joi.objectId())
		});
		return schema.validate(besoin);
	},
	bien: (bien) => {
		const schema = Joi.object({
			nom: Joi.string().min(3).max(50).required(),
			images: Joi.array()
		});
		return schema.validate(bien);
	},
	donnateur: (donnateur) => {
		const schema = Joi.object({
			nom: Joi.string().min(3).max(50).required(),
			email: Joi.string().min(5).max(50).required().email(),
			telephone: Joi.string().min(3).max(50).required()
		});
		return schema.validate(donnateur);
	},
	don: (don) => {
		const schema = Joi.object({
			donnateurId: Joi.objectId().required(),
			associationId: Joi.objectId().required(),
			biensId: Joi.array().items(Joi.objectId()),
			message: Joi.string().max(400).allow('')
		});
		return schema.validate(don);
	},
	user: (user) => {
		const schema = Joi.object({
			nom: Joi.string().min(3).max(50),
			email: Joi.string().min(5).max(50).required().email(),
			password: Joi.string().min(3).max(50).required(),
			isAdmin: Joi.boolean()
		});
		return schema.validate(user);
	}
};
