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
  new Date(startDate.getTime() + Math.random() * (endDate - startDate));

const getCountry = (random) =>
  random
    ? countries[Math.floor(Math.random() * countries.length)]
    : { countryShortCode: 'ES' };

const getRegion = (random, country) =>
  random
    ? country.regions[Math.floor(Math.random() * country.regions.length)]
    : { shortCode: 'M' };

const getRandomSubset = (list, maxSize, minSize = 0) =>
  list
    .sort(() => 0.5 - Math.random())
    .slice(minSize, maxSize === 1 ? 1 : Math.floor(Math.random() * maxSize));

module.exports = {
  createPrompt,
  getRandomDate,
  getCountry,
  getRegion,
  getRandomSubset,
};
