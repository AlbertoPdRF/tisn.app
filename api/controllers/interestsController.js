const Interest = require('../models/Interest');

exports.get = (req, res, next) => {
  return Interest.find()
    .populate('category')
    .then(interests => {
      if (!interests) {
        return res.sendStatus(400);
      }

      res.json({ interests });
    });
};

exports.post = (req, res, next) => {
  const { body: { interest } } = req;

  if (!interest.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  if (!interest.avatar) {
    return res.status(422).json({
      errors: {
        avatar: 'is required',
      },
    });
  }

  if (!interest.category) {
    return res.status(422).json({
      errors: {
        category: 'is required',
      },
    });
  }

  const finalInterest = new Interest(interest);

  return finalInterest.save()
    .then(() => res.json({ interest: finalInterest }));
};



exports.get_id = (req, res, next) => {
  return Interest.findById(req.params.id)
    .populate('category')
    .then(interest => {
      if (!interest) {
        return res.sendStatus(400);
      }

      res.json({ interest });
    });
};

