const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');

const { validationErrMessage, conflictErrEmail, notFoundUser } = require('../utils/constants');

const changeUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { runValidators: true, new: true })
    .orFail(new NotFoundError(notFoundUser))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(validationErrMessage));
      } else if (err.code === 11000) {
        next(new ConflictError(conflictErrEmail));
      } else {
        next(err);
      }
    });
};

const getMe = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => res.send(user))
    .catch(next);
};

module.exports = {
  changeUserInfo,
  getMe,
};
