const Event = require('../models/Event');

exports.get = (req, res, next) => {
  return Event.find()
    .populate('relatedInterests', 'name avatar')
    .then((events) => {
      if (!events) {
        return res.sendStatus(400);
      }

      res.json({ events });
    });
};

exports.post = (req, res, next) => {
  const {
    body: { event },
  } = req;

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

  if (!event.createdBy) {
    return res.status(422).json({
      errors: {
        createdBy: 'is required',
      },
    });
  }

  const finalEvent = new Event(event);

  return finalEvent.save().then(() => res.json({ event: finalEvent }));
};

exports.getId = (req, res, next) => {
  return Event.findById(req.params.id)
    .populate('relatedInterests', 'name avatar')
    .then((event) => {
      if (!event) {
        return res.sendStatus(400);
      }

      res.json({ event });
    });
};

exports.putId = (req, res, next) => {
  const {
    body: { event },
  } = req;

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

  if (!event.createdBy) {
    return res.status(422).json({
      errors: {
        createdBy: 'is required',
      },
    });
  }

  Event.findOneAndUpdate(
    {
      _id: req.params.id,
      createdBy: req.payload.admin ? event.createdBy : req.payload._id,
    },
    event,
    { new: true }
  )
    .populate('relatedInterests', 'name avatar')
    .then((updatedEvent) => {
      if (!updatedEvent) {
        res.status(500).json({ error: "something wen't wrong" });
      }

      res.json({ event: updatedEvent });
    });
};
