//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit')
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRouter')
const userRoute = require('./Routes/userRoute')
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')

let app = express();

//let limiter=rateLimit()   calling rateLimit() returns a middleware function which ex
let limiter=rateLimit({
    max:1000,                   //max requests
    windowMs:60*60*1000,        //time frame
    message:"We have received too many requests from this IP. PLease try after 1 hr"
})

//All the above middleware to all urls that start with /api
//Using thsi middleware sets three more headers
//X-RateLimit-Limit =max limit
//X-RateLimit-Remaining =remaining requests
//X-RateLimit-Reset =whwn time rests i mean the duration restarts
//Restarting the application restrats the counter
app.use('/api',limiter)


app.use(express.json());

app.use(express.static('./public'))

//USING ROUTES


app.use('/api/v1/movies', moviesRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRoute);
app.all('*', (req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server!`
    // });
    // const err = new Error(`Can't find ${req.originalUrl} on the server!`);
    // err.status = 'fail';
    // err.statusCode = 404;
    const err = new CustomError(`Can't find ${req.originalUrl} on the server!`, 404);
    next(err);
});

app.use(globalErrorHandler);

module.exports = app;


//npm install express-rate-limit

