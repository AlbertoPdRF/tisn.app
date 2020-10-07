const prompts = require('prompts');
const countries = require('country-region-data');

const createPrompt = async (message) => {
  let answer = await prompts({
    type: 'confirm',
    name: 'value',
    message,
    initial: true,
  });

  return answer.value;
};

const getRandomDate = (startDate, endDate) =>
  new Date(+startDate + Math.random() * (endDate - startDate));

const getRandomCountry = (randomLocation) => 
  randomLocation 
    ? countries[Math.floor(Math.random() * countries.length)]
    : { countryShortCode: 'ES' };

const getRandomRegion = (randomLocation, country) => 
  randomLocation
    ? country.regions[Math.floor(Math.random() * country.regions.length)]
    : { shortCode: 'M' };

const getRandomInterests = (interests) =>
  interests
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * interests.length));

module.exports = { 
  createPrompt,
  getRandomDate,
  getRandomCountry,
  getRandomRegion,
  getRandomInterests
}