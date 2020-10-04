require('dotenv').config();
const mongoose = require('mongoose');
const mongoDB = process.env.DB_URL;

const connectMongoDb = () => {
  console.log('Mongo Db:', mongoDB);
  mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
  mongoose.Promise = global.Promise;
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
}

const closeMongoDb = () => {
  mongoose.connection.close();
}

module.exports = {connectMongoDb, closeMongoDb}
