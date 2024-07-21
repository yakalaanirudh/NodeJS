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
