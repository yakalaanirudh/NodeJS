const { param } = require('../Routes/moviesRoutes');
const Movie = require('../Models/movieModel');
const ApiFeatures = require('../Utils/ApiFeatures');
const asyncErrorhandler=require('./../Utils/asyncErrorhandler')

exports.getHighestRated = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratings';

    next();
}

exports.getAllMovies = asyncErrorHandler(async (req, res,next) => {
        const features = new ApiFeatures(Movie.find(), req.query)
                                .filter()
                                .sort()
                                .limitFields()
                                .paginate();
                                
        //means run the query on the query object returned from apifeatures
        //means get the documents on the current query object
        let movies = await features.query;
        //Mongoose 6.0 or less
        /**************Mongoose 6.0 or less************** 
        const excludeFields = ['sort', 'page', 'limit', 'fields'];
        const queryObj = {...req.query};
        excludeFields.forEach((el) => {
            delete queryObj[el]
        })
        const movies = await Movie.find(queryObj);
        **************************************************/

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });
    
})

exports.getMovie = asyncErrorHandler(async (req, res,next) => {
        //const movie = await Movie.findOne({_id: req.params.id});
        const movie = await Movie.findById(req.params.id);

        //We can use this code in update and delete a movie too
        if(!movie){
            const error=new CustomError('Movie with that ID is not found',404)
            //Once express encounters err it calls directly global error handling middleware bypassing all else
            //If we pass error to next() express know it encountered an error
            //We dont pass this in getAll movies because
            //Even if the user applied some filters to make number of resulting movies 0
            //It is not an error so we are not using it there
            return next(error)      
        }

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });

})

/*
const asyncErrorhandler=(func)=>{
    func(req,res,next).catch(err=>next(err))
}
*/




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
exports.createMovie = asyncErrorhandler(async (req, res) => {
    try{
        const movie = await Movie.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                movie
            }
        })
    }catch(err){
        
        //res.status(400).json({
        //    status: 'fail',
        //    message: err.message
        })
       const error=new CustomError(err.message,400)
       next(error)  //We ares ending it to global error handling middleware
    }
})
*/

exports.updateMovie = asyncErrorHandler(async (req, res,next) => {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        if(!updatedMovie){
            const error=new CustomError('Movie with that ID is not found',404)
            return next(error)
        }


        res.status(200).json({
            status: "success",
            data: {
                movie: updatedMovie
            }
        });
})

exports.deleteMovie = asyncErrorHandler(async (req, res,next) => {
        const deletedMovie=await Movie.findByIdAndDelete(req.params.id);

        if(!deletedMovie){
            const error=new CustomError('Movie with that ID is not found',404)
            return next(error)
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    
})

exports.getMovieStats = asyncErrorHandler(async (req, res,next) => {
        const stats = await Movie.aggregate([
            { $match: {ratings: {$gte: 4.5}}},
            { $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$ratings'},
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price'},
                movieCount: { $sum: 1}
            }},
            { $sort: { minPrice: 1}}
            //{ $match: {maxPrice: {$gte: 60}}}
        ]);

        res.status(200).json({
            status: 'success',
            count: stats.length,
            data: {
                stats
            }
        });
})

exports.getMovieByGenre = asyncErrorHandler(async (req, res) => {
        const genre = req.params.genre;
        const movies = await Movie.aggregate([
            {$unwind: '$genres'},
            {$group: {
                _id: '$genres',
                movieCount: { $sum: 1},
                movies: {$push: '$name'}, 
            }},
            {$addFields: {genre: "$_id"}},
            {$project: {_id: 0}},
            {$sort: {movieCount: -1}},
            //{$limit: 6}
            //{$match: {genre: genre}}
        ]);

        res.status(200).json({
            status: 'success',
            count: movies.length,
            data: {
                movies
            }
        });
})


/*
//NOW START
exports.getAllMovies = async (req, res) => {
    try{
        const features = new ApiFeatures(Movie.find(), req.query).filter()

        let movies = await features.query;

        res.status(200).json({
            status: 'success',
            length: movies.length,
            data: {
                movies
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
    
}

class Apifeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }
    filter(){
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);

        //here we are assigning the query result from sort to a query for further execution
        this.query = this.query.find(queryObj);

        return this;
    }
}
    



const features = new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().paginate();
let movies = await features.query;
             


When you have const features = new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().paginate();, 
you're chaining method calls (filter(), sort(), limitFields(), paginate()) on an instance of ApiFeatures. 
These methods likely modify the initial query (Movie.find() in this case) based on the req.query parameters.

Then, let movies = await features.query; 
executes the modified query stored in the query property of features and assigns the result to movies. 
So, you're correct that features.query holds the result of the executed query, 
but features itself is not a query object; rather, 
it's an instance of ApiFeatures that helps in building and executing the query.

Therefore, your understanding is mostly right:

features is not exactly a query object; it's an instance of ApiFeatures.
features.query refers to the result of the executed query after chaining the various query-building methods.
*/