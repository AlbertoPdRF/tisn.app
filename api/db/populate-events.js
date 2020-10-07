const prompts = require('prompts');

const Interest = require('../models/Interest');
const User = require('../models/User');
const Event = require('../models/Event');

const createPrompt = async (message) => {
  let answer = await prompts({
    type: 'confirm',
    name: 'value',
    message,
    initial: true,
  });

  return answer.value;
};

const createEvent = async (eventParams) => {
  const event = new Event({
    name: eventParams.name,
    description: eventParams.description,
    startDate: eventParams.startDate,
    endDate: eventParams.endDate,
    country: eventParams.country,
    region: eventParams.region,
    createdBy: eventParams.user,
    relatedInterests: eventParams.interests,
    attendantsLimit: eventParams.attendantsLimit,
  });
  await event.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New event created: ${event}`);
  }
};

const createEvents = async (multiplier, randomLocation, verbose) => {
  console.log('\n', '\x1b[0m', 'Populating events collection...');
  displayLogs = verbose;

  let usersList = await User.distinct('_id');
  if (usersList.length === 0) {
    console.log(
      '\x1b[33m',
      'The users collection does not exist. Aborted events collection population.'
    );
    return;
  }

  let interestsList = await Interest.distinct('_id');
  if (interestsList.length === 0) {
    const proceed = await createPrompt(
      'The interests collection does not exist. Events created will not have any related interests. Do you want to continue?'
    );
    if (!proceed) {
      console.log('\x1b[33m', 'Aborted events collection population');
      return;
    }
  }

  // createEvent();
};

module.exports = { createEvents };
