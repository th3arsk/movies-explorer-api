const router = require('express').Router();
const authRouter = require('express').Router();

const {
  validateCreateMovie,
  validateMovieId,
  validateChangeUserInfo,
  validateSignIn,
  validateSignUp
} = require('../middlewares/validation.js');

const { postMovie, deleteMovie, getUserMovies } = require('../controllers/movies.js');
const { changeUserInfo, getMe } = require('../controllers/users.js');
const { signIn, signUp } = require('../controllers/register.js');

router.post('/movies', validateCreateMovie, postMovie );
router.delete('/movies/:movieId', validateMovieId, deleteMovie );
router.get('/movies', getUserMovies );

router.patch('/users/me', validateChangeUserInfo, changeUserInfo );
router.get('/users/me', getMe );

authRouter.post('/signin', validateSignIn, signIn);
authRouter.post('/signup', validateSignUp, signUp);

module.exports = { router, authRouter };




