const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

const auth = {
  required: jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  }),
};

module.exports = auth;
