const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const auth = require('../middlewares/auth');

const {
  validateCreateMovie,
  validateMovieId,
  validateChangeUserInfo,
  validateSignIn,
  validateSignUp,
} = require('../middlewares/validation');

const { postMovie, deleteMovie, getUserMovies } = require('../controllers/movies');
const { changeUserInfo, getMe } = require('../controllers/users');
const { signIn, signUp } = require('../controllers/register');
const { notFountRoute, crushServerMessage } = require('../utils/constants');

router.post('/movies', auth, validateCreateMovie, postMovie);
router.delete('/movies/:movieId', auth, validateMovieId, deleteMovie);
router.get('/movies', auth, getUserMovies);

router.patch('/users/me', auth, validateChangeUserInfo, changeUserInfo);
router.get('/users/me', auth, getMe);

router.post('/signin', validateSignIn, signIn);
router.post('/signup', validateSignUp, signUp);

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(crushServerMessage);
  }, 0);
});

router.use('*', (req, res, next) => {
  next(new NotFoundError(notFountRoute));
});

module.exports = { router };
