const { getRandomSubset } = require('./utils');

const User = require('../models/User');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');

let displayLogs;

const createAttendant = async (attendantParams) => {
  const attendant = new Attendant({
    event: attendantParams.event,
    user: attendantParams.user,
  });
  await attendant.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New attendant created: ${attendant}`);
  }
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

  let eventsList = await Event.find();
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

  for (const event of eventsList) {
    const attendees = attendantsList
      .filter((attendee) => attendee.event.toString() == event._id.toString())
      .map((attendee) => attendee.user.toString());

    const users = usersList.filter(
      (user) => !attendees.includes(user.toString())
    );

    const availability = event.attendantsLimit - attendees.length;
    const subset = getRandomSubset(users, availability);

    for (const user of subset) {
      const attendantParams = { event, user };
      attendantsArray.push(await createAttendant(attendantParams));
    }
  }

  console.log('\x1b[32m', `Created ${attendantsArray.length} attendants`);
};

module.exports = { createAttendants };
