const jwt = require('jsonwebtoken');
const AuthorizationError = require('../errors/AuthorizationError');
const { authErrMessage } = require('../utils/constants');

const { JWT_SECRET, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization.split('Bearer ')[1];

  if (!token) {
    next(new AuthorizationError(authErrMessage));
  }

  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV ? JWT_SECRET : 'dev_secret');
  } catch (error) {
    next(new AuthorizationError(authErrMessage));
  }

  req.user = payload;

  next();
};

module.exports = auth;
