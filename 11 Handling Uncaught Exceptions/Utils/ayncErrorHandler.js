const asyncErrorhandler=(func)=>{
    return()=>{
    func(req,res,next).catch(err=>next(err))
    }
}



exports.createMovie = asyncErrorhandler(async (req, res,next) => {

    const movie = await Movie.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            movie
        }
    })
})


/*
const Operations = (Mathfunc) => {
    return (a, b) => {
        return Mathfunc(a, b);
    }
}

let addFunc = (a, b) => a + b;
let addOperation = Operations(addFunc);
console.log(addOperation(10, 7)); // Outputs: 17
The updated Operations function and the original operations function are functionally the same. 
They both correctly return a new function that applies the 
provided function to two arguments and returns the result. 
*/