const Attendant = require('../models/Attendant');

exports.get = (req, res, next) => {
  return Attendant.find({ event: req.params.eventId })
    .populate('user', 'name avatar')
    .then((attendants) => res.json({ attendants }));
};

exports.post = (req, res, next) => {
  const attendant = new Attendant(req.body.attendant);

  return attendant.save().then(() => res.json({ attendant }));
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
