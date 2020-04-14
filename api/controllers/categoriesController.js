const Category = require('../models/Category');

exports.get = (req, res, next) => {
  return Category.find().then((categories) => {
    if (!categories) {
      return res.sendStatus(400);
    }

    res.json({ categories });
  });
};

exports.post = (req, res, next) => {
  const {
    body: { category },
  } = req;

  if (!category.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  const finalCategory = new Category(category);

  return finalCategory.save().then(() => res.json({ category: finalCategory }));
};

exports.getId = (req, res, next) => {
  return Category.findById(req.params.id).then((category) => {
    if (!category) {
      return res.sendStatus(400);
    }

    res.json({ category });
  });
};
