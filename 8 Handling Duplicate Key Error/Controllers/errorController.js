const CustomError = require('./../Utils/CustomError');

//In development we want to know all about the error
//So we want status, message,stack trace and the complete error object
const devErrors = (res, error) => {
    res.status(error.statusCode).json({
        status: error.statusCode,
        message: error.message,
        stackTrace: error.stack,
        error: error                    //Sending the complete error object
    });
}

const castErrorHandler = (err) => {
    //err.path is teh field for which we passed the value
    //Invalid value for id:kdfkdbf
    const msg = `Invalid value for ${err.path}: ${err.value}!`
    return new CustomError(msg, 400);
}


const duplicateKeyErrorHandler = (err) => {
    //Get the keyValue.name property from error object and assign it to name
    const name = err.keyValue.name;
    const msg = `There is already a movie with name ${name}. Please use another name!`;
    
    return new CustomError(msg, 400);
}



//In production if it is operational error we want the end client to know just the error message and the status code
//If it is a programming error we will send a msg that something went wrong
//Almost all the opertioanl errors we created are using customerror handler
//So all errors will have access to isOperational variable
const prodErrors = (res, error) => {
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    }else {
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong! Please try again later.'
        })
    }
}

module.exports=(error,req,res,next)=>{
    error.statusCode=error.statusCode||500;
    error.status=error.status||"error";


    if(process.env.NODE_ENV === 'development'){
        devErrors(res, error);
    } else if(process.env.NODE_ENV === 'production'){
        //If we are in production and we encounter these errors
        //we send the custom message instead of generic message
        //CAST ERRORS are those we get when we query an object with invalid ID
        //CAST ERRORS have a property named error.name in the error object
        if(error.name === 'CastError') error = castErrorHandler(error);

        //For duplicate key error the error object wont have a name field but a error.code field
        //Duplicate key errors are what we get when we try to create a object with same unique property again
        if(error.code === 11000) error = duplicateKeyErrorHandler(error);

        prodErrors(res, error);
    }
}


/*
To set environment from devlopment to production
SET NODE_ENV=production &nodemon server.js

if in script tag in package json we added the production:SET NODE_ENV=production &nodemon server.js
we can do npm run production

let a={name:"Arthur",age:26,gender:"male"}
let b={...a,weight:75}
console.log(b)                  //{name: 'Arthur', age: 26, gender: 'male', weight: 75}
*/