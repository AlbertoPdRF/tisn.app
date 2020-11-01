const Interest = require('../models/Interest');

exports.get = (req, res, next) => {
	return Interest.find()
		.sort('name')
		.then((interests) => {
			if (interests.length === 0) {
				return res.sendStatus(404);
			}

			res.json({ interests });
		});
};
