#! /usr/bin/env node

/*
Options:
1. Populate all db's
2. Populate individual db's
3. Talked about implementing log flags (verbose, pertinent)
*/

const minimist = require('minimist');

const userArgs = minimist(process.argv.slice(2), {
  string: ['table'],
  boolean: ['verbose'],
  alias: [{v: 'verbose'}, {t: 'table'}]
});

const populateAllTables = () => {
  console.log('All tables will be populated');
};

const populateSpecifiedTable = () => {
  switch (userArgs.t.toLowerCase()) {
    case 'users':
      console.log('Users table will be populated');
      break;
    case 'interests':
      console.log('Interests table will be populated');
      break;
    default:
      console.log('Table or script does not exist');
      break;
  };
};

console.log(userArgs);
userArgs.t ? populateSpecifiedTable() : populateAllTables();
