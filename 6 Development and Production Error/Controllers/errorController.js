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

        prodErrors(res, error);
    }
}