const Attendant = require('../models/Attendant');
const Notification = require('../models/Notification');

exports.get = (req, res, next) => {
	return Attendant.find({ event: req.params.eventId })
		.populate('user', 'name avatar')
		.then((attendants) => res.json({ attendants }));
};

exports.post = (req, res, next) => {
	const {
		body: { attendant },
	} = req;

	Attendant.find({ event: attendant.event._id }).then((attendants) => {
		if (attendants.length >= attendant.event.attendantsLimit) {
			return res.status(400).json({
				errors: [
					{
						param: 'Attendants limit',
						value: attendant.event.attendantsLimit,
						msg: 'has been met',
					},
				],
			});
		} else {
			if (attendants.some((a) => a.user == attendant.user._id)) {
				return res.sendStatus(400);
			}

			const finalAttendant = new Attendant(attendant);

			return finalAttendant.save().then(() => {
				const notification = new Notification({
					user: attendant.event.createdBy,
					type: 'newAttendant',
					referencedUser: attendant.user._id,
					referencedEvent: attendant.event._id,
				});
				notification.save();

				res.json({ attendant: finalAttendant });
			});
		}
	});
};

exports.deleteId = (req, res, next) => {
	return Attendant.findByIdAndRemove(req.params.attendantId).then(
		(attendant) => {
			if (!attendant) {
				return res.sendStatus(404);
			}

			res.json({ attendant });
		}
	);
};
