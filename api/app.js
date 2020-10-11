require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
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

const { connectDb } = require('./db/connection');
connectDb(process.env.DB_URL);

require('./config/passport');

// Configure CORS for a single origin
const corsOptions = {
  origin: function (origin, callback) {
    // If origin is the same as the value in BASE_CLIENT_URL, allow access
    if (origin === process.env.BASE_CLIENT_URL) {
      callback(null, true)
    }
    else {
      callback(createError(403))
    }
  }
}

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', require('./routes/index'));

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
