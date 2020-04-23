const Category = require('../models/Category');

exports.post = (req, res, next) => {
  const category = new Category(req.body.category);

  return category.save().then(() => res.json({ category }));
};
