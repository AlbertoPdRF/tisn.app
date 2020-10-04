const User = require('../models/User');
const Interest = require('../models/Interest');

const { uniqueNamesGenerator, names } = require('unique-names-generator');
const countries = require('country-region-data');
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

  if (displayLogs) console.log(`New User: ${user}`);
};

const getRandomDate = (startDate, endDate) =>
  new Date(+startDate + Math.random() * (endDate - startDate));

const createAdminUser = () => () => {
  createUser(
    {
      name: 'Admin',
      email: `admin@tisn.app`,
      emailConfirmed: true,
      emailConfirmedAt: new Date(),
      country: 'US',
      region: 'FL',
      preferredLocale: 'en',
      dateOfBirth: new Date(2000, 01, 01),
      interests: [],
      admin: true,
    }
  );
};


const createUsers = async (verbose, admin, numberOfRecords) => {
  displayLogs = verbose;
  console.log('Populating users...')
  let interestsList = await Interest.distinct('_id');
  const now = new Date();
  const usersArray = [];

  if (admin) usersArray.push(createAdminUser());

  for (let i = 0; i < numberOfRecords; i++) {
    const name = uniqueNamesGenerator({
      dictionaries: [names, names],
      separator: ' ',
    });
    const country = countries[Math.floor(Math.random() * countries.length)];
    const region =
      country.regions[Math.floor(Math.random() * country.regions.length)];

    const userParams = {
      name,
      email: `${name.replace(/ /g, '_')}@tisn.app`.toLowerCase(),
      emailConfirmed: true,
      emailConfirmedAt: getRandomDate(new Date(2020, 05, 05), now),
      country: country.countryShortCode,
      region: region.shortCode || region.name,
      preferredLocale: locales[Math.floor(Math.random() * 2)],
      dateOfBirth: getRandomDate(
        new Date(1970, 01, 01),
        new Date().setFullYear(now.getFullYear() - 13)
      ),
      interests: interestsList
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * interestsList.length)),
      admin: false,
    };

    usersArray.push(
      await createUser(userParams)
    );
  }

  console.log(`Users created: ${usersArray.length}`);
  return usersArray;
};

module.exports = {createUsers}
