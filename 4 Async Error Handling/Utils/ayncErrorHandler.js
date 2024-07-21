const asyncErrorhandler=(func)=>{
    return(req,res,next)=>{
    func(req,res,next).catch(err=>next(err))
    }
}



/*
LEVEL 1
createMovie,updateMovie,deleteMovie these will be assigned to func variable
Async function returns  a promise
the catch method handles if the promise is rejected
const asyncErrorhandler=(func)=>{
    func(req,res,next).catch(err=>next(err))
}

*/


/*
LEVEL 2
Initially we are assigning the reult of
async (req, res,next) => {

    const movie = await Movie.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            movie
        }
    })
        this to create Movie
        But we have a problem 
        thh asynchandler function inside function doesnt know what are req,res,and which function calling it(func parameter)
        and it executes immediately
        so to execute it only when a request is received we make it an anonymous function and return it
        This anonymous function is assigned to create Movie


const asyncErrorhandler=(func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(err=>next(err))
    }
}

*/


/*
Here the function is invoked directly
const asyncErrorhandler=(func)=>{
    func(req,res,next).catch(err=>next(err))
}

here the inner function invokes only when a request is received
const asyncErrorhandler=(func)=>{
    return (req,res,next)=>{
        func(req,res,next).catch(err=>next(err))
    }
}

*/

 