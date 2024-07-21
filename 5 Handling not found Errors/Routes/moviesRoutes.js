const express = require('express');
const moviesController = require('../Controllers/moviesController');

const router = express.Router();

//router.param('id', moviesController.checkId)

router.route('/highest-rated').get(moviesController.getHighestRated, moviesController.getAllMovies)

router.route('/movie-stats').get(moviesController.getMovieStats);

router.route('/movies-by-genre/:genre').get(moviesController.getMovieByGenre);

router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)
/*
We can do this too
router.route('/')
    .get(asyncErrorHandler(moviesController.getAllMovies))
    .post(asyncErrorHandler(moviesController.createMovie))

    But we didnt because if we do this way then we have to remember which funtctions are async and we can 
    wrap asyncErrorHandler only around them

    If we pass it to sync method; sync method doesnt return a promise so we cant catch the error
*/

router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router;