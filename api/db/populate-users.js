const {
  createPrompt,
  getRandomDate,
  getCountry,
  getRegion,
  getRandomSubset,
} = require('./utils');
const { uniqueNamesGenerator, names } = require('unique-names-generator');

const User = require('../models/User');
const Interest = require('../models/Interest');

const locales = ['en', 'es'];
let displayLogs;

const createUser = async (userParams) => {
  const user = new User({
    name: userParams.name,
    email: userParams.email,
    emailConfirmed: userParams.emailConfirmed,
    emailConfirmedAt: userParams.emailConfirmedAt,
    dateOfBirth: userParams.dateOfBirth,
    country: userParams.country,
    region: userParams.region,
    preferredLocale: userParams.preferredLocale,
    interests: userParams.interests,
    admin: userParams.admin,
  });
  user.setPassword('password');
  await user.save();

  if (displayLogs) {
    console.log('\n', '\x1b[0m', `New user created: ${user}`);
  }
  return user;
};

const createAdminUser = () => {
  createUser({
    name: 'Admin',
    email: `admin@tisn.app`,
    emailConfirmed: true,
    emailConfirmedAt: new Date(),
    country: 'ES',
    region: 'M',
    preferredLocale: 'en',
    dateOfBirth: new Date(2000, 0, 1),
    interests: [],
    admin: true,
  });

  console.log(
    '\x1b[32m',
    `
    Admin user created:
    \tName: Admin
    \tEmail: admin@tisn.app
    \tPassword: password
  `
  );
};

const createUsers = async (multiplier, randomLocation, verbose) => {
  console.log('\n', '\x1b[0m', 'Populating users collection...');
  displayLogs = verbose;

  let interestsList = await Interest.distinct('_id');
  const now = new Date();
  const usersArray = [];

  if (interestsList.length === 0) {
    const proceed = await createPrompt(
      'The interests collection does not exist. Users created will not have any interests. Do you want to continue?'
    );
    if (!proceed) {
      console.log('\x1b[33m', 'Aborted users collection population');
      return;
    }
  }

  if (!(await User.exists({ email: 'admin@tisn.app' }))) createAdminUser();

  for (let i = 0; i < 100 * multiplier; i++) {
    const name = uniqueNamesGenerator({
      dictionaries: [names, names],
      separator: ' ',
    });
    const country = getCountry(randomLocation);
    const region = getRegion(randomLocation, country);

    const userParams = {
      name,
      email: `${name.replace(/ /g, '_')}@tisn.app`.toLowerCase(),
      emailConfirmed: true,
      emailConfirmedAt: getRandomDate(new Date(2020, 4, 5), now),
      country: country.countryShortCode,
      region: region.shortCode || region.name,
      preferredLocale: locales[Math.floor(Math.random() * 2)],
      dateOfBirth: getRandomDate(
        new Date(1970, 0, 1),
        new Date().setFullYear(now.getFullYear() - 13)
      ),
      interests: getRandomSubset(interestsList, interestsList.length),
      admin: false,
    };

    usersArray.push(await createUser(userParams));
  }

  console.log('\x1b[32m', `Created ${usersArray.length} regular users`);
};

module.exports = { createUsers };
