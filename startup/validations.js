const Joi = require('joi');

module.exports = {
	association: (association) => {
		const schema = Joi.object({
			nom: Joi.string().min(3).max(50).required(),
			images: Joi.array(),
			besoinsId: Joi.array().items(Joi.objectId()),
			description: Joi.string().max(255).allow(''),
			telephone: Joi.string().min(3).max(50).required(),
			email: Joi.string().min(5).max(50).required().email(),
			password: Joi.string().min(5).max(255).required()
		});
		return schema.validate(association);
	},
	besoin: (besoin) => {
		const schema = Joi.object({
			bienId: Joi.objectId().required(),
			associationId: Joi.objectId().required(),
			satisfied: Joi.boolean()
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
	}
};
