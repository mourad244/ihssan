const { Association } = require('../models/association');
const config = require('config');

module.exports = function (req, res, next) {
	// 401 Unauthorized
	// 403 Forbidden
	if (!config.get('requiresAuth')) return next();

	if (!canUpdate(req.user, req.params.id)) {
		res.status(403);
		return res.send('Access denied.');
	}
	next();
};

//
async function canUpdate(user, associationId) {
	let association = await Association.findById(associationId);
	return association.usersEmail.some((e) => e.email === user.email);
}

async function canView(user, associationId) {}

async function scoped(user, associations) {
	// if (user.role === ROLE.ADMIN) return associations;
	// return associations.filter((association) => association.userId === user.id);
}
