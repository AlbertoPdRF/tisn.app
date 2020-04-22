const Event = require('../models/Event');
const Attendant = require('../models/Attendant');
const Comment = require('../models/Comment');

const async = require('async');

exports.get = (req, res, next) => {
  return Event.find()
    .populate('relatedInterests', 'name avatar')
    .then((events) => {
      if (events.length === 0) {
        return res.sendStatus(404);
      }

      res.json({ events });
    });
};

exports.post = (req, res, next) => {
  const {
    body: { event },
  } = req;

  const finalEvent = new Event(event);

  return finalEvent.save().then(() => res.json({ event: finalEvent }));
};

exports.getId = (req, res, next) => {
  return Event.findById(req.params.eventId)
    .populate('relatedInterests', 'name avatar')
    .then((event) => {
      if (!event) {
        return res.sendStatus(404);
      }

      res.json({ event });
    });
};

exports.putId = (req, res, next) => {
  const {
    body: { event },
  } = req;

  Event.findOneAndUpdate(
    {
      _id: req.params.eventId,
      createdBy: req.payload.admin ? event.createdBy : req.payload._id,
    },
    event,
    { new: true }
  )
    .populate('relatedInterests', 'name avatar')
    .then((updatedEvent) => {
      if (!updatedEvent) {
        return res.sendStatus(404);
      }

      res.json({ event: updatedEvent });
    });
};

exports.deleteId = (req, res, next) => {
  const {
    body: { event },
  } = req;

  const id = req.params.eventId;
  async.parallel(
    {
      event: (callback) =>
        Event.findOneAndRemove({
          _id: id,
          createdBy: req.payload.admin ? event.createdBy : req.payload._id,
        }).exec(callback),
      attendants: (callback) =>
        Attendant.deleteMany({
          event: id,
        }).exec(callback),
      comments: (callback) =>
        Comment.deleteMany({
          event: id,
        }).exec(callback),
    },
    (error, results) => {
      if (error) {
        return next(error);
      }

      if (!results) {
        return res.sendStatus(404);
      }

      res.json({
        event: results.event,
        attendants: results.attendants,
        comments: results.comments,
      });
    }
  );
};
