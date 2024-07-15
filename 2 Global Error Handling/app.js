//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');

let app = express();

app.use(express.json());

app.use(express.static('./public'))

//USING ROUTES
app.use('/api/v1/movies', moviesRouter)

//When we try to access a route that doesnt exist say 127.0.0.1:3000/api/v1/moviessss
//We initially sent a HTML response that page doesnt exist
//Now we are sending a JSON response
//${req.originalUrl} is the url for which the route is not found 
//* is for all urls since it handles all urls we need to use it after all routes
app.use('*',(req,res,next)=>{
    /*
    res.status(404).json({
        status:"fail",
        message:`Cant find ${req.originalUrl} on the server`
    })
    */

    const err =new Error(`Cant find ${req.originalUrl} on the server`);
    err.status='fail!'
    err.statusCode=404;

    //whenever we pass an argument to next function express knows an error occurred and skips all middleware and goes to error handling middleware
    // Pass the error to the next middleware (error handling middleware)
    next(err)
})


//GLOBAL ERROR HANDLING
//400-499 client errors
//500-599 server errors
app.use((error,req,res,next)=>{
    error.statusCode=error.statusCode||500;
    error.status=error.status||"error";
    res.status(error.statusCode).json({
        status:error.status,
        message:error.message
    })
})

module.exports = app;

