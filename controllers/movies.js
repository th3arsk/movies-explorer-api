const Movie = require('../models/movie');

const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const AccessError = require('../errors/AccessError');

const { validationErrMessage, accessErrMessage, notFoundMovie } = require('../utils/constants');

const postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  const owner = req.user._id;

  Movie.create({
    owner,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(validationErrMessage));
      } else {
        next(err);
      }
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(new NotFoundError(notFoundMovie))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie).then(res.json(movie));
      } else if (movie.owner !== req.user._id) {
        throw new AccessError(accessErrMessage);
      }
    })
    .catch(next);
};

const getUserMovies = (req, res, next) => {
  const userId = req.user._id;

  Movie.find({ owner: userId })
    .then((userMovies) => {
      res.send(userMovies);
    })
    .catch(next);
};

module.exports = {
  postMovie,
  deleteMovie,
  getUserMovies,
};
