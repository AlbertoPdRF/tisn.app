const Event = require('../models/Event');
const Attendee = require('../models/Attendee');
const Comment = require('../models/Comment');

const async = require('async');

exports.get = (req, res, next) => {
  const { query } = req;

  const filter = {};
  if (query.fromDate) {
    filter.startDate = { $gte: query.fromDate };
  }
  if (query.country) {
    filter.country = query.country;

    if (query.region) {
      filter.region = query.region;
    }
  }
  if (query.interests) {
    filter.relatedInterests = { $in: query.interests };
  }

  if (query.name) {
    filter.name = { $regex: query.name, $options: 'i' };
  }
  if (query.relatedInterests) {
    filter.relatedInterests = { $all: query.relatedInterests };
  }

  return Event.find(filter)
    .populate('relatedInterests', 'name avatar')
    .sort('startDate')
    .then((events) => res.json({ events }));
};

exports.post = (req, res, next) => {
  const {
    body: { event },
  } = req;

  const finalEvent = new Event(event);

  return finalEvent.save().then(() => {
    const attendee = new Attendee({
      event: finalEvent._id,
      user: finalEvent.createdBy,
    });
    attendee.save();

    res.json({ event: finalEvent });
  });
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
      attendees: (callback) =>
        Attendee.deleteMany({
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
        attendees: results.attendees,
        comments: results.comments,
      });
    }
  );
};
