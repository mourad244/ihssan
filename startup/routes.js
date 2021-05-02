const express = require('express');

const associations = require('../routes/associations');
const users = require('../routes/users');
const biens = require('../routes/biens');
const besoins = require('../routes/besoins');

const auth = require('../routes/auth');
const error = require('../middleware/error');
const cors = require('cors');
var bodyParser = require('body-parser');

module.exports = function (app) {
	app.use(cors());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(express.json());
	app.use('/ihssan/associations', associations);
	app.use('/ihssan/users', users);
	app.use('/ihssan/biens', biens);
	app.use('/ihssan/besoins', besoins);

	app.use('/ihssan/auth', auth);
	app.use(error);
};
