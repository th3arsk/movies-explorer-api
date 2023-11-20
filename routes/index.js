const router = require('express').Router();
const authRouter = require('express').Router();

const {
  validateCreateMovie,
  validateMovieId,
  validateChangeUserInfo,
  validateSignIn,
  validateSignUp
} = require('../middlewares/validation');

const { postMovie, deleteMovie, getUserMovies } = require('../controllers/movies');
const { changeUserInfo, getMe } = require('../controllers/users');
const { signIn, signUp } = require('../controllers/register');

router.post('/movies', validateCreateMovie, postMovie );
router.delete('/movies/:movieId', validateMovieId, deleteMovie );
router.get('/movies', getUserMovies );

router.patch('/users/me', validateChangeUserInfo, changeUserInfo );
router.get('/users/me', getMe );

authRouter.post('/signin', validateSignIn, signIn);
authRouter.post('/signup', validateSignUp, signUp);

module.exports = { router, authRouter };




