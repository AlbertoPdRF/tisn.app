const mongoose = require('mongoose');

const getDbUrl = () => {
  require('dotenv').config();
  return process.env.DB_URL;
};

const connectDb = (dbUrl = getDbUrl()) => {
  mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
};

const closeDb = () => {
  mongoose.connection.close();
};

module.exports = { connectDb, closeDb, getDbUrl };
