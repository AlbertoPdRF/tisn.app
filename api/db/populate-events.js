const txtgen = require('txtgen');
const {
  uniqueNamesGenerator,
  adjectives,
  animals,
  starWars,
  colors,
} = require('unique-names-generator');
const {
  createPrompt,
  getRandomDate,
  getCountry,
  getRegion,
  getRandomSubset,
} = require('./utils');

const Interest = require('../models/Interest');
const User = require('../models/User');
const Event = require('../models/Event');

const createEvent = async (eventParams) => {
  const event = new Event({
    name: eventParams.name,
    description: eventParams.description,
    startDate: eventParams.startDate,
    endDate: eventParams.endDate,
    country: eventParams.country,
    region: eventParams.region,
    createdBy: eventParams.createdBy,
    relatedInterests: eventParams.relatedInterests,
    coverPhoto: eventParams.coverPhoto,
    attendantsLimit: eventParams.attendantsLimit,
  });
  await event.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New event created: ${event}`);
  }
  return event;
};

const createEvents = async (multiplier, randomLocation, verbose) => {
  console.log('\n', '\x1b[0m', 'Populating events collection...');

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

  displayLogs = verbose;
  const eventsArray = [];

  const now = new Date();
  const futureDate = new Date().setFullYear(now.getFullYear() + 5);

  for (let i = 0; i < 500 * multiplier; i++) {
    const name = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors, starWars],
      length: 3,
      style: 'capital',
      separator: ' ',
    });

    const description = txtgen.article(Math.ceil(Math.random() * 2));

    const startDate = getRandomDate(now, futureDate);
    const endDate = getRandomDate(
      new Date(startDate.getTime() + 60000),
      new Date(startDate.getTime() + 86400000 * 2)
    );

    const country = getCountry(randomLocation);
    const region = getRegion(randomLocation, country);

    const eventParams = {
      name,
      description,
      startDate,
      endDate,
      country: country.countryShortCode,
      region: region.shortCode,
      createdBy: usersList[Math.floor(Math.random() * usersList.length)],
      relatedInterests: getRandomSubset(interestsList, interestsList.length, 1),
      coverPhoto: '',
      attendantsLimit: Math.floor(Math.random() * (usersList.length - 1)) + 2,
    };

    eventsArray.push(await createEvent(eventParams));
  }

  console.log('\x1b[32m', `Created ${eventsArray.length} events`);
};

module.exports = { createEvents };
