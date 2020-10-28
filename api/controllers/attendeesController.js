const Attendee = require('../models/Attendee');
const Notification = require('../models/Notification');

exports.get = (req, res, next) => {
  return Attendee.find({ event: req.params.eventId })
    .populate('user', 'name avatar')
    .then((attendees) => res.json({ attendees }));
};

exports.post = (req, res, next) => {
  const {
    body: { attendee },
  } = req;

  Attendee.find({ event: attendee.event._id }).then((attendees) => {
    if (attendees.length >= attendee.event.attendeesLimit) {
      return res.status(400).json({
        errors: [
          {
            param: 'Attendees limit',
            value: attendee.event.attendeesLimit,
            msg: 'has been met',
          },
        ],
      });
    } else {
      if (attendees.some((a) => a.user == attendee.user._id)) {
        return res.sendStatus(400);
      }

      const finalAttendee = new Attendee(attendee);

      return finalAttendee.save().then(() => {
        const notification = new Notification({
          user: attendee.event.createdBy,
          type: 'newAttendee',
          referencedUser: attendee.user._id,
          referencedEvent: attendee.event._id,
        });
        notification.save();

        res.json({ attendee: finalAttendee });
      });
    }
  });
};

exports.deleteId = (req, res, next) => {
  return Attendee.findByIdAndRemove(req.params.attendeeId).then(
    (attendee) => {
      if (!attendee) {
        return res.sendStatus(404);
      }

      res.json({ attendee });
    }
  );
};
