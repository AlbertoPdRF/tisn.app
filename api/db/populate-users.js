#! /usr/bin/env node

// TODO: This will all be in the general js to abide by DRY principal
const userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "Error: you need to specify a valid MongoDB URL as the first argument"
  );

  return;
}

const User = require("../models/User");
const Interest = require("../models/Interest");

const asynchronous = require("async");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
const numberOfRecords = userArgs[1] || 100;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const { uniqueNamesGenerator, names } = require("unique-names-generator");
const countries = require("country-region-data");
const locales = ["en", "es"];
const users = [];

const createUser = async (userParams, callback) => {
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
  user.setPassword("password");
  await user.save();

  console.log(`New User: ${user}`);
  users.push(user);
  callback(null, user);
};

const getRandomDate = (startDate, endDate) =>
  new Date(+startDate + Math.random() * (endDate - startDate));

const createAdminUser = () => (seriesCallback) => {
  createUser(
    {
      name: "Admin",
      email: `admin@tisn.app`,
      emailConfirmed: true,
      emailConfirmedAt: new Date(),
      country: "US",
      region: "FL",
      preferredLocale: "en",
      dateOfBirth: new Date(),
      interests: [],
      admin: true,
    },
    seriesCallback
  );
};

const generateUsersArray = async () => {
  let interestsList = await Interest.distinct("_id");

  const now = new Date();
  const usersArray = [];

  usersArray.push(createAdminUser());

  for (let i = 0; i < numberOfRecords; i++) {
    const name = uniqueNamesGenerator({
      dictionaries: [names, names],
      separator: " ",
    });
    const country = countries[Math.floor(Math.random() * countries.length)];
    const region =
      country.regions[Math.floor(Math.random() * country.regions.length)];

    const userParams = {
      name,
      email: `${name.replace(/ /g, "_")}@tisn.app`.toLowerCase(),
      emailConfirmed: true,
      emailConfirmedAt: getRandomDate(new Date(2020, 05, 05), now),
      country: country.countryShortCode,
      region: region.shortCode || "N/A",
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

    usersArray.push((seriesCallback) => {
      createUser(userParams, seriesCallback);
    });
  }

  return usersArray;
};

const createUsers = async () => {
  asynchronous.series(await generateUsersArray(), (error, results) => {
    if (error) {
      console.log(`Final error: ${error}`);
    } else {
      console.log(`Final results: ${results}`);
    }

    mongoose.connection.close();
  });
};

createUsers();
