const express = require('express');
const { Association } = require('../models/association');
const { User } = require('../models/user');
const getPathData = require('../middleware/getPathData');
const validations = require('../startup/validations');
const uploadImages = require('../middleware/uploadImages');
const deleteImages = require('../middleware/deleteImages');
const auth = require('../middleware/auth');
const _ = require('lodash');
const admin = require('../middleware/admin');
const role = require('../middleware/role');
const logger = require('../startup/logging');

const validateObjectId = require('../middleware/validateObjectId');

const router = express.Router();

router.get('/', async (req, res) => {
	const associations = await Association.find().populate('biensId').select('-__v -password').sort('nom');
	res.send(associations);
});

router.post('/', [auth, admin], async (req, res) => {
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
		return res.status(400).send('an association a déja cet email.');
	}

	const { nom, description, adresse, telephone, email, usersEmail } = req.body;
	const { image: images } = getPathData(req.files);

	const users = await User.find({
		email: {
			$in: usersEmail
		}
	});
	if (!users) {
		deleteImages(req.files);
		return res.status(404).send("email donnée pour administrer l'association n'est associé à aucun utilisateur");
	}

	association = new Association({
		nom: nom,
		description: description,
		adresse: adresse,
		telephone: telephone,
		email: email,

		images: images ? images.map((file) => file.path) : []
	});
	users.map((e) => {
		let user = _.pick(e, ['email', 'nom', '_id']);
		// condtion if the user has already exists in the list

		association.usersEmail.push(user);
	});

	await association.save();

	res.send(association);
});
router.put('/:id', [auth, admin], async (req, res) => {
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
	const { nom, description, adresse, telephone, email, usersEmail } = req.body;
	const { image: images } = getPathData(req.files);

	const users = await User.find({
		email: {
			$in: usersEmail
		}
	});
	if (!users) {
		deleteImages(req.files);
		return res.status(404).send("aucun utilisateur  avec cette email n'est enrgeristé.");
	}

	const association = await Association.findById(req.params.id);
	if (!association) {
		deleteImages(req.files);
		return res.status(404).send("le association avec cette id n'existe pas.");
	}
	association.nom = nom;
	association.description = description;
	association.adresse = adresse;
	association.telephone = telephone;
	association.email = email;

	users.map((e) => {
		let user = _.pick(e, ['email', 'nom', '_id']);
		// condition if the user has already exists in the list
		addIfNotExist(association.usersEmail, user);
	});
	if (images) association.images.push(...images.map((file) => file.path));

	await association.save();

	res.send(association);
});

router.get('/:id', validateObjectId, async (req, res) => {
	const result = await Association.findById(req.params.id).populate('biensId').select('-__v -password');
	// .populate("avis", "-association")

	res.send(result);
	// let newResult = result.avis;
});

router.delete('/:id', [auth, admin], async (req, res) => {
	const association = await Association.findByIdAndRemove(req.params.id);
	if (!association) return res.status(404).send("le association avec cette id n'existe pas.");
	if (association.images) deleteImages(association.images);

	res.send(association);
});
router.put('/compte/:associationId', [auth, role], async (req, res) => {
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
	const { nom, description, adresse, telephone } = req.body;

	const association = await Association.findByIdAndUpdate(
		{ _id: req.params.associationId },
		{
			nom: nom,
			description: description,
			adresse: adresse,
			telephone: telephone
		},
		function (err, results) {
			if (err) {
				console.log(err);
				deleteImages(req.files);
				return res.status(404).send("l'association avec cette id n'existe pas.");
			}
		}
	);

	await association.save();

	res.send(association);
});

// functions
function addIfNotExist(users, user) {
	const found = users.some((el) => el.email === user.email);
	if (!found) users.push(user);
	return users;
}

// route pour l'utilisateur de chaque association

module.exports = router;
