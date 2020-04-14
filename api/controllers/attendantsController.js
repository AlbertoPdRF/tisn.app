const Attendant = require('../models/Attendant');

exports.get = (req, res, next) => {
  return Attendant.find({ event: req.params.eventId })
    .populate('user', 'name avatar')
    .then((attendants) => {
      if (!attendants) {
        return res.sendStatus(400);
      }

      res.json({ attendants });
    });
};

exports.post = (req, res, next) => {
  const {
    body: { attendant },
  } = req;

  if (!attendant.event) {
    return res.status(422).json({
      errors: {
        event: 'is required',
      },
    });
  }

  if (!attendant.user) {
    return res.status(422).json({
      errors: {
        user: 'is required',
      },
    });
  }

  const finalAttendant = new Attendant(attendant);

  return finalAttendant
    .save()
    .then(() => res.json({ attendant: finalAttendant }));
};

exports.deleteId = (req, res, next) => {
  return Attendant.findByIdAndRemove(req.params.id).then((attendant) => {
    if (!attendant) {
      return res.sendStatus(400);
    }

    res.json({ attendant });
  });
};
