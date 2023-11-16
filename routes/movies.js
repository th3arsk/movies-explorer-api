const router = require('express').Router();

const { validateCreateMovie, validateMovieId } = require('../middlewares/validation');

const { postMovie, deleteMovie, getUserMovies } = require('../controllers/movies');

router.post('/movies', validateCreateMovie, postMovie );
router.delete('/movies/:movieId', validateMovieId, deleteMovie );
router.get('/movies', getUserMovies );

module.exports = router;