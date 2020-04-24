const Attendant = require('../models/Attendant');
const Event = require('../models/Event');

const async = require('async');

exports.get = (req, res, next) => {
  return Attendant.find({ event: req.params.eventId })
    .populate('user', 'name avatar')
    .then((attendants) => res.json({ attendants }));
};

exports.post = (req, res, next) => {
  const {
    body: { attendant },
  } = req;

  async.parallel(
    {
      event: (callback) => Event.findById(attendant.event).exec(callback),
      attendants: (callback) =>
        Attendant.find({ event: attendant.event }).exec(callback),
    },
    (error, results) => {
      if (error) {
        return next(error);
      }

      if (!results) {
        return res.sendStatus(404);
      }

      if (results.attendants.length >= results.event.attendantsLimit) {
        return res.status(400).json({
          errors: [
            {
              param: 'Attendants limit',
              value: results.event.attendantsLimit,
              msg: 'already met',
            },
          ],
        });
      }

      const finalAttendant = new Attendant(attendant);

      return finalAttendant
        .save()
        .then(() => res.json({ attendant: finalAttendant }));
    }
  );
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
