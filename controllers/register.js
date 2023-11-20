const User = require('../models/user.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const ConflictError = require('../errors/ConflictError.js');
const NotFoundError = require('../errors/NotFoundError.js');
const ValidationError = require('../errors/ValidationError.js');

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
            next(new ValidationError('Некорректные данные'));
          } else if (err.code === 11000) {
            next(new ConflictError('Такой пользователь уже существует'));
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
      res.status(200).send({ token, _id: user._id});

      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports = {
  signUp,
  signIn,
};

