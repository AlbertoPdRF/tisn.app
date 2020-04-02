const Event = require('../models/Event');

exports.get = (req, res, next) => {
  return Event.find()
    .populate('relatedInterests', 'name avatar')
    .then(events => {
      if (!events) {
        return res.sendStatus(400);
      }

      res.json({ events });
    });
};

exports.post = (req, res, next) => {
  const { body: { event } } = req;

  if (!event.name) {
    return res.status(422).json({
      errors: {
        name: 'is required',
      },
    });
  }

  if (!event.description) {
    return res.status(422).json({
      errors: {
        description: 'is required',
      },
    });
  }

  if (!event.startDate) {
    return res.status(422).json({
      errors: {
        startDate: 'is required',
      },
    });
  }

  if (!event.endDate) {
    return res.status(422).json({
      errors: {
        endDate: 'is required',
      },
    });
  }

  const finalEvent = new Event(event);

  return finalEvent.save()
    .then(() => res.json({ event: finalEvent }));
};



exports.get_id = (req, res, next) => {
  return Event.findById(req.params.id)
    .populate('createdBy', 'name')
    .populate({
      path: 'relatedInterests',
      populate: { path: 'category' }
    })
    .populate('attendants', 'name')
    .then(event => {
      if (!event) {
        return res.sendStatus(400);
      }

      res.json({ event });
    });
};
