const { getRandomSubset, createPrompt } = require('./utils');
const {
  createNotification,
  notificationTypes,
} = require('./populate-notifications');

const User = require('../models/User');
const Event = require('../models/Event');
const Attendee = require('../models/Attendee');

let displayLogs;
let notificationsCount = 0;

const createAttendee = async (attendeeParams) => {
  const attendee = new Attendee(attendeeParams);
  await attendee.save();

  // New attendee notification
  if (attendee.user.toString() !== attendee.event.createdBy.toString()) {
    await createNotification(
      {
        user: attendee.event.createdBy,
        type: notificationTypes[4],
        read: false,
        referencedUser: attendee.user,
        referencedEvent: attendee.event,
      },
      displayLogs
    );
    notificationsCount++;
  }

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New attendee created: ${attendee}`);
  }
  return attendee;
};

const createAttendees = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating attendees collection...');

  let usersList = await User.distinct('_id');
  if (usersList.length === 0) {
    console.log(
      '\x1b[33m',
      'The users collection does not exist. Aborted attendees collection population.'
    );
    return;
  }

  let eventsList = await Event.find({
    startDate: { $gte: new Date() },
  });
  if (eventsList.length === 0) {
    console.log(
      '\x1b[33m',
      'The events collection does not exist. Aborted attendees collection population.'
    );
    return;
  }

  displayLogs = verbose;
  let attendeesList = await Attendee.find();
  const attendeesArray = [];

  let proceed = true;
  if (attendeesList.length !== 0) {
    proceed = await createPrompt(
      'Some events already contain attendees. Would you like to add attendees to events that already contain attendees?'
    );
  }

  for (const event of eventsList) {
    const attendees = attendeesList
      .filter((attendee) => attendee.event.toString() === event._id.toString())
      .map((attendee) => attendee.user.toString());

    const spotsLeft = event.attendeesLimit - attendees.length;
    if (spotsLeft <= 0 || (!proceed && attendees.length > 0)) continue;

    const eventCreator = event.createdBy.toString();
    const potentialAttendees = usersList.filter(
      (user) =>
        !(
          attendees.includes(user.toString()) ||
          user.toString() === eventCreator
        )
    );

    const creatorIncluded = attendees.includes(eventCreator);
    const subset = getRandomSubset(
      potentialAttendees,
      creatorIncluded ? spotsLeft : spotsLeft - 1
    );

    if (!creatorIncluded) {
      subset.unshift(eventCreator);
    }

    for (const user of subset) {
      const attendeeParams = { event, user };
      attendeesArray.push(await createAttendee(attendeeParams));
    }
  }

  console.log(
    '\x1b[32m',
    `Created ${attendeesArray.length} attendees (and ${notificationsCount} related notifications)`
  );
};

module.exports = { createAttendees };
