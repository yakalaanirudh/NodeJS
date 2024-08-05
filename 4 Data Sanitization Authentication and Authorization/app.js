//IMPORT PACKAGE
const express = require('express');
const morgan = require('morgan');
const rateLimit=require('express-rate-limit') //This rateLimit returns a function. calling that function returns middleware function
const helmet=require('helmet')      //This helmet returns a function. calling that function returns middleware function
const sanitize=require("express-mongo-sanitize")
const xss=require("xss-clean")
const moviesRouter = require('./Routes/moviesRoutes');
const authRouter = require('./Routes/authRouter')
const userRoute = require('./Routes/userRoute')
const CustomError = require('./Utils/CustomError');
const globalErrorHandler = require('./Controllers/errorController')

let app = express();

app.use(helmet())   //This adds more headers to our app making it more secure

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

//This prevents denial of service attack
app.use(express.json({limit:'10kb'}));  //Mac 10 KB in request body accepted  if more it truncates the rest of the data

//Calling sanitize() returns a middleware function that cleans request body of all mogo code
//In the above we limit the received Body and now we clean it
app.use(sanitize()) 
//Calling xss() returns a middleware function that cleans request body of all js induced html code
app.use(xss())      

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


//npm install express-rate-limit for rate limiting
//npm install helmet for setting http security headers

//These malicious data can be used to delete important data from DB
//email:{"gt": " "}       //Malicious NOSQL query in request body
//email:<h1 id="some-id"></h1>       //Malicious NOSQL query in request body
//npm install express-mongo-sanitize    //To clean malicious Mogo code in request body
//npm install xss-clean    //To clean malicious  code in request body

