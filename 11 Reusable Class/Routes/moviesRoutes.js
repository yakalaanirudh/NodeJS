const express = require('express');
const moviesController = require('./../Controllers/moviesController');

const router = express.Router();

router.param('id', moviesController.checkId)

//Aliased Route
/*
//Suppose 127.0.0,:3000?limit=5&sort=-ratings is most frequently used url
127.0.0,:3000?limit=5&sort=-ratings we rename this as highest rated
so when we do get request from 127.0.0.1/highest rated we get the highest rated movies we dont ahve to pass sort and limit
moviesController.highest-rated is the middleware we use
when the query is passed to middleware it adds to query the sort and limit values
the entire query(with we added sort and limit) is passed to getAllMovies 
*/
router.route('/highest-rated').get(moviesController.gethighestRated, moviesController.getAllMovies)


router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.validateBody, moviesController.createMovie)


router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router;