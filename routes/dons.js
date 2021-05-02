const { Don } = require('../models/don');
const auth = require('../middleware/auth');
const express = require('express');
const validations = require('../startup/validations');
const role = require('../middleware/role');
const { Donnateur } = require('../models/donnateur');
const { Association } = require('../models/association');
const router = express.Router();

// get all dons of an association
router.get('/:associationId', [auth, role], async (req, res) => {
	const dons = await Don.find({ associationId: req.params.associationId })
		.populate('donnateurId', '-donsId')
		.select('-biensId -__v');
	res.send(dons);
});

// get a specific don of an association
router.get('/:associationId/:id', [auth, role], async (req, res) => {
	const don = await Don.lookup(req.params.associationId, req.params.id);

	if (!don) return res.status(404).send("don avec cette id n'existe pas.");

	don.vu = true;
	await don.save();
	res.send(don);
});

router.post('/:associationId', async (req, res) => {
	const association = Association.findById(req.params.associationId);
	if (!association) return res.status(404).send("l'association avec cette id n'existe pas.");
	const { error } = validations.don(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const { email, nom, message, biensId, telephone } = req.body;
	// search if client aldready exists
	// { $set: {'yourcoll.$.someField': 'Value'} }, { upsert: true, new: true }
	let donnateur = await Donnateur.findOneAndUpdate(
		{ email: email },
		{ $set: { nom: nom, telephone: telephone } },
		{ upsert: true, new: true }
	);
	if (!donnateur) {
		donnateur = new Donnateur({
			nom: nom,
			email: email,
			telephone: telephone
		});
	}

	const don = new Don({
		associationId: req.params.associationId,
		donnateurId: donnateur._id,
		biensId: biensId,
		message: message
	});

	donnateur.donsId.push(don._id);
	await donnateur.save();
	await don.save();

	res.send(don);
});

module.exports = router;
