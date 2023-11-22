const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');

const { validationErrMessage, conflictErrUser, notFoundUser } = require('../utils/constants');

const signUp = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        email,
        password: hash,
      })
        .then((user) => res.status(201).send({
          name: user.name,
          email: user.email,
          _id: user._id,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new ValidationError(validationErrMessage));
          } else if (err.code === 11000) {
            next(new ConflictError(conflictErrUser));
          } else {
            next(err);
          }
        });
    });
};

const signIn = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV ? JWT_SECRET : 'dev_secret', { expiresIn: '7d' });
      res.status(200).send({ token, _id: user._id });

      if (!user) {
        throw new NotFoundError(notFoundUser);
      }
    })
    .catch(next);
};

module.exports = {
  signUp,
  signIn,
};
