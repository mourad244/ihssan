const { Bien } = require('../models/bien');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const express = require('express');
const uploadImages = require('../middleware/uploadImages');
const validations = require('../startup/validations');
const router = express.Router();

router.get('/', async (req, res) => {
	const biens = await Bien.find().select('-__v');
	res.send(biens);
});
router.get('/:id', async (req, res) => {
	const bien = await Bien.findById(req.params.id).select('-__v');

	if (!bien) return res.status(404).send("bien avec cette id n'existe pas.");

	res.send(bien);
});

router.post('/', [auth, admin], async (req, res) => {
	try {
		await uploadImages(req, res);
	} catch (error) {
		res.status(500).send({
			message: `Could not upload the images: ${req.files.originalname}. ${err}`
		});
	}
	const { error } = validations.bien(req.body);
	if (error) {
		deleteImages(req.files);
		return res.status(400).send(error.details[0].message);
	}

	const { nom } = req.body;
	const { image: images } = getPathData(req.files);

	const bien = new Bien({
		nom: nom,
		images: images ? images.map((file) => file.path) : []
	});

	await bien.save();

	res.send(bien);
});
router.put('/:id', [auth, admin], async (req, res) => {
	try {
		await uploadImages(req, res);
	} catch (error) {
		res.status(500).send({
			message: `Could not upload the images: ${req.files.originalname}. ${error}`
		});
	}

	const { error } = validations.bien(req.body);
	if (error) {
		deleteImages(req.files);
		return res.status(400).send(error.details[0].message);
	}

	const bien = await Bien.findOne({ _id: req.params.id });
	if (!bien) {
		deleteImages(req.files);
		return res.status(404).send("le produit avec cette id n'existe pas.");
	}

	const { nom } = req.body;
	const { image: images } = getPathData(req.files);

	// if an attribute not allowed to be empty add if()
	if (nom) bien.nom = nom;

	if (images) bien.images.push(...images.map((file) => file.path));

	await bien.save();

	res.send(bien);
});

router.delete('/:id', [auth, admin], async (req, res) => {
	const bien = await Bien.findByIdAndRemove(req.params.id);
	if (!bien) return res.status(404).send("le bien avec cette id n'existe pas.");
	if (bien.images) deleteImages(bien.images);
});

module.exports = router;
