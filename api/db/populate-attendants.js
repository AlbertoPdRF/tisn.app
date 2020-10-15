const { getRandomSubset, createPrompt } = require('./utils');
const { createNotification } = require('./populate-notifications');

const User = require('../models/User');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');

let displayLogs;

const createAttendant = async (attendantParams) => {
  const attendant = new Attendant(attendantParams);
  await attendant.save();

  // New attendee notification
  await createNotification({
    user: attendantParams.event.createdBy,
    type: 'newAttendant',
    read: false,
    referencedUser: attendant.user,
    referencedEvent: attendant.event,
  });

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New attendant created: ${attendant}`);
  }
  return attendant;
};

const createAttendants = async (verbose) => {
  console.log('\n', '\x1b[0m', 'Populating attendants collection...');

  let usersList = await User.distinct('_id');
  if (usersList.length === 0) {
    console.log(
      '\x1b[33m',
      'The users collection does not exist. Aborted attendants collection population.'
    );
    return;
  }

  let eventsList = await Event.find({
    startDate: { $gte: new Date() },
  });
  if (eventsList.length === 0) {
    console.log(
      '\x1b[33m',
      'The events collection does not exist. Aborted attendants collection population.'
    );
    return;
  }

  displayLogs = verbose;
  let attendantsList = await Attendant.find();
  const attendantsArray = [];

  let proceed = true;
  if (attendantsList.length !== 0) {
    proceed = await createPrompt(
      'Some events already contain attendees. Would you like to add attendees to events that already contain attendees?'
    );
  }

  for (const event of eventsList) {
    const attendees = attendantsList
      .filter((attendee) => attendee.event.toString() === event._id.toString())
      .map((attendee) => attendee.user.toString());

    const spotsLeft = event.attendantsLimit - attendees.length;
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
      const attendantParams = { event, user };
      attendantsArray.push(await createAttendant(attendantParams));
    }
  }

  console.log('\x1b[32m', `Created ${attendantsArray.length} attendants`);
};

module.exports = { createAttendants };
