require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const i18nextBackend = require('i18next-fs-backend');

i18next.use(i18nextBackend).init({
  backend: {
    loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
  },
  fallbackLng: 'en',
  preload: ['en', 'es'],
});

const app = express();

app.use(i18nextMiddleware.handle(i18next));

const mongoDB = process.env.DB_URL;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
mongoose.set('useFindAndModify', false);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./config/passport');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/', require('./routes/index'));

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
  return;
});

module.exports = app;
