const express = require('express');
const { Association } = require('../models/association');
const getPathData = require('../middleware/getPathData');
const validations = require('../startup/validations');
const uploadImages = require('../middleware/uploadImages');
const deleteImages = require('../middleware/deleteImages');
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const admin = require('../middleware/admin');
const logger = require('../startup/logging');

const validateObjectId = require('../middleware/validateObjectId');
const _ = require('lodash');

const router = express.Router();

router.get('/', async (req, res) => {
	const associations = await Association.find().select('-__v ').sort('nom');
	res.send(associations);
});

router.post('/', [admin, auth], async (req, res) => {
	try {
		await uploadImages(req, res);
	} catch (err) {
		res.status(500).send({
			message: `Could not upload the images: ${req.files.originalname}. ${err}`
		});
	}
	const { error } = validations.association(req.body);
	if (error) {
		deleteImages(req.files);
		return res.status(400).send(error.details[0].message);
	}

	let association = await Association.findOne({ email: req.body.email });
	if (association) {
		deleteImages(req.files);
		return res.status(400).send('User already registered.');
	}

	const { nom, description, besoinsId, telephone, email, password } = req.body;
	const { image: images } = getPathData(req.files);

	association = new Association({
		nom: nom,
		description: description,
		// besoinsId: besoinsId,
		telephone: telephone,
		email: email,
		images: images ? images.map((file) => file.path) : []
	});

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(password, salt);

	await association.save();

	res.send(association);
});

router.put('/:id', auth, async (req, res) => {
	try {
		await uploadImages(req, res);
	} catch (error) {
		res.status(500).send({
			message: `Could not upload the images: ${req.files.originalname}. ${error}`
		});
	}

	const { error } = validations.association(req.body);
	if (error) {
		deleteImages(req.files);
		return res.status(400).send(error.details[0].message);
	}

	const association = await Association.findOne({ _id: req.params.id });
	if (!association) {
		deleteImages(req.files);
		return res.status(404).send("le produit avec cette id n'existe pas.");
	}

	const { nom, description } = req.body;
	const { image: images } = getPathData(req.files);

	if (nom) association.nom = nom;
	association.description = description;
	if (images) association.images.push(...images.map((file) => file.path));

	await association.save();

	res.send(association);
});

router.get('/:id', validateObjectId, async (req, res) => {
	const result = await Association.findById(req.params.id).populate('', 'nom');
	// .populate("avis", "-association")

	res.send(result);
	// let newResult = result.avis;
});

router.delete('/:id', auth, async (req, res) => {
	const association = await Association.findByIdAndRemove(req.params.id);
	if (!association) return res.status(404).send("le association avec cette id n'existe pas.");
	if (association.images) deleteImages(association.images);

	res.send(association);
});

module.exports = router;
