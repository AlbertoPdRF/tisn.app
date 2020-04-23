const Interest = require('../models/Interest');

exports.get = (req, res, next) => {
  return Interest.find()
    .populate('category')
    .sort('name')
    .then((interests) => {
      if (interests.length === 0) {
        return res.sendStatus(404);
      }

      res.json({ interests });
    });
};

exports.post = (req, res, next) => {
  const interest = new Interest(req.body.interest);

  return interest.save().then(() => res.json({ interest }));
};
