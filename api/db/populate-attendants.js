const User = require('../models/User');
const Event = require('../models/Event');
const Attendant = require('../models/Attendant');

let displayLogs;

const createAttendant = async (attendantParams) => {
  const attendant = new Attendant({
    user: attendantParams.user,
    event: attendantParams.event,
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

  let attendantsList = await Attendant.find();

  // For each event, get a random number of users <= attendants limit
  // Attendants limit - attendees
  eventsList.forEach((event) => {
    console.log('Event');
  });
};

module.exports = { createAttendants };
