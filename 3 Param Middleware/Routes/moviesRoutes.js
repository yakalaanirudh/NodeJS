//This file is going to contain all the routes for movies
const express=require('express')
const moviesController=require('./../Controller/moviesController')



//const moviesRouter= express.Router()  //Instead of calling moviesRouter just call it router
const router= express.Router()

//Param Middleware is a middleware that runs only for certain route params
//The id is passed into value in the callback function
//This middleware is executed only for localhost/api/movies/id
//This middleware is not executed only for localhost/api/movies/
/*
router.param('id',(req,res,next,value)=>{
    console.log("Movie ID is "+value)
    next()
})
*/
router.param('id',moviesController.checkId)

//moviesRouter.route('/') //This /(url) is appended to the url in the moviesRouter url
router.route('/')
.get(moviesController.getAllMovies)
.post(moviesController.createMovie)

//moviesRouter.route('/:id')  //This /:id(url) is appended to the url in the moviesRouter url
router.route('/:id')
.get(moviesController.getSingleMovie)
.patch(moviesController.updateMovie)
.delete(moviesController.deleteMovie)


module.exports=router