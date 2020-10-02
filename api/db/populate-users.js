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
const Token = require("../models/Token");
const crypto = require("crypto");

const asynchronous = require("async");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const { uniqueNamesGenerator, names } = require("unique-names-generator");
const countries = require("country-region-data");
const locales = ["en", "es"];
const users = [];

const createUser = async (
  name,
  email,
  emailConfirmed,
  emailConfirmedAt,
  dateOfBirth,
  country,
  region,
  preferredLocale,
  interests,
  admin,
  callback
) => {
  const user = new User({
    name,
    email,
    emailConfirmed,
    emailConfirmedAt,
    dateOfBirth,
    country,
    region,
    preferredLocale,
    interests,
    admin,
  });
  user.setPassword("password");
  await user.save();
  const token = createTokenForUser(user);
  await token.save();

  console.log(`New User: ${user}`);
  users.push(user);
  callback(null, user);
};

function randomDate(start, end) {
  return new Date(+start + Math.random() * (end - start));
}

createTokenForUser = (user) => {
  return new Token({
    user,
    type: "Email",
    token: crypto.randomBytes(16).toString("hex"),
  });
};

const generateUsersArray = async () => {
  let interests = await Interest.distinct("_id");
  const config = {
    dictionaries: [names],
  };

  const usersArray = [];
  for (let i = 0; i < 100; i++) {
    const name = `${uniqueNamesGenerator(config)} ${uniqueNamesGenerator(
      config
    )}`;
    const email = `${name.replace(
      / /g,
      "_"
    )}@test-tisn-email.com`.toLowerCase();
    const country = countries[Math.floor(Math.random() * countries.length)];
    const region =
      country.regions[Math.floor(Math.random() * country.regions.length)];
    const enrolledDate = randomDate(new Date(2019, 01, 01), new Date());
    const birthDate = randomDate(
      new Date(1950, 01, 01),
      new Date(2007, 01, 01)
    );
    interests = interests.sort(() => 0.5 - Math.random());
    const selectedInterests = interests.slice(
      0,
      Math.floor(Math.random() * 10)
    );

    usersArray.push((seriesCallback) => {
      createUser(
        name,
        email,
        true,
        enrolledDate,
        birthDate,
        country.countryShortCode,
        region.shortCode || "N/A",
        locales[Math.floor(Math.random() * 2)],
        selectedInterests,
        false,
        seriesCallback
      );
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
