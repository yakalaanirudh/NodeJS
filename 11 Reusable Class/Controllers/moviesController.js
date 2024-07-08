const fs = require('fs');

let movies = JSON.parse(fs.readFileSync('./data/movies.json'));


exports.getAllMovies=(req,res,next)=>{
    req.query.limit=5
    req.query.sort='-ratings'
    next()

}

exports.checkId = (req, res, next, value) => {
    console.log('Movie ID is ' + value);

    //FIND MOVIE BASED ON ID PARAMETER
    let movie = movies.find(el => el.id === value * 1);

    if(!movie){
        return res.status(404).json({
            status: "fail",
            message: 'Movie with ID ' +value+ ' is not found'
        })
    }
    next();
}

exports.validateBody = (req, res, next) => {
    if(!req.body.name || !req.body.releaseYear){
        return res.status(400).json({
            status: 'fail',
            message: 'Not a valid movie data'
        });
    }
    next();
}
/*
exports.getAllMovies = (req, res) => {
    res.status(200).json({
        status: "sucess",
        requestedAt: req.requestedAt,
        count: movies.length,
        data: {
            movies: movies
        }
    });
}

exports.getMovie = (req, res) => {
    //console.log(req.params);
    //CONVERT ID TO NUMBER TYPE
    const id = req.params.id * 1;

    //FIND MOVIE BASED ON ID PARAMETER
    let movie = movies.find(el => el.id === id);

    // if(!movie){
    //     return res.status(404).json({
    //         status: "fail",
    //         message: 'Movie with ID ' +id+ ' is not found'
    //     })
    // }

    //SEND MOVIE IN THE RESPONSE
    res.status(200).json({
        status: "success",
        data: {
            movie: movie
        }
    });
}
*/
/*
exports.createMovie = (req, res) => {
    //console.log(req.body);
    const newId = movies[movies.length - 1].id + 1;
    const newMovie = Object.assign({id: newId}, req.body)
    movies.push(newMovie);
    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                movie: newMovie
            }
        })
    })
    //res.send('Created');
}

*/
exports.createMovie=async (req,res)=>{
    //This create method will take some time to execute so we await
    //since we used await we wrap the entire function in async
    //Since we are valiadating the created Movie from schema we created we can remove the validate method from middleware
    //Suppose we add an extra field in request body taht is not defined in the scehma
    //Then that key and value pair wont be added to that database since it aint defined it schema
    try{
    const movie=Movie.create({req.body})
        res.status(201).json({
            status:"success",
            data:{
                //If key and value variable same we can use only once 
                //movie:movie so we can just use movie
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status:"fail",
            message:err.message
        })
    }
}

exports.getMovies=async (req,res)=>{
    try{
        //console.log(req.query)
        /*
        //This is all movies
        //const movie = await movies.find();
        */
        /*
        const movies = await movies.find({duration:+req.query.duration,ratings:+req.query.ratings});
        Find movies with the passed query strings
        */
        /*
        Here we are directly passing the query string as req.query
        //const movie = await movies.find(req.query);
        //The issue with this approach is if we have keys that are not in schema
        like page=20 and/or sort
        127.0.0.1:3000/api/v1/movies/?page=20&sort
        */

        /*
        //Here we are using mongoose query builder
        const movies =await Movie.find().where('duration').equals(req.query.duration).where('ratings').equals(req.query.ratings)
        

        The problem with this is 
        if we pass a url with no query string we will not receive a response
        127.0.0.1:3000/api/v1/movies
        */
        
        /*
        //mongoose 6.0 or less
        const excludeFields=['sort','page','limit','fields']
        const queryObj={...req.query}

        excludeFields.forEach((el)=>{
            delete queryObj[el]
        })

        const movies=await Movie.find(queryObj)
        */
        //Mongoose 6.0 above
        const movie = await movies.find(req.query);
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

exports.getMovie = async (req, res) => {
    try{
        //const movie = await Movie.findOne({_id: req.params.id});
        //The below is a concide code
        const movie = await movies.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                movie
            }
        });
    }catch(err){
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

/*
exports.updateMovie = (req, res) => {
    let id = req.params.id * 1;
    let movieToUpdate = movies.find(el => el.id === id);

    // if(!movieToUpdate){
    //     return res.status(404).json({
    //         status:'fail',
    //         message: 'No movie object with ID ' +id+ ' is found'
    //     })

    // }
    let index = movies.indexOf(movieToUpdate);//e.g. - id = 4, index = 3

    Object.assign(movieToUpdate, req.body);

    movies[index] = movieToUpdate;

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(200).json({
            status: "success",
            data: {
                movie: movieToUpdate
            }
        })
    })
}

exports.deleteMovie = (req, res) => {
    const id = req.params.id * 1;
    const movieToDelete = movies.find(el => el.id === id);

    // if(!movieToDelete){
    //     return res.status(404).json({
    //         status:'fail',
    //         message: 'No movie object with ID ' +id+ ' is found to delete'
    //     })

    // }

    const index = movies.indexOf(movieToDelete);

    movies.splice(index, 1);

    fs.writeFile('./data/movies.json', JSON.stringify(movies), (err) => {
        res.status(204).json({
            status: "success",
            data: {
                movie: null
            }
        })
    })
}
*/

exports.updateMovie = async (req, res) => {
    try{
        //{new: true, runValidators: true}
        //new: true means after updating return the new object not the old one with old data
        //runValidators: true means run all validators in schema like name must, duration must, name unique
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

        res.status(200).json({
            status: "success",
            data: {
                movie: updatedMovie
            }
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}

exports.deleteMovie = async (req, res) => {
    try{
        await Movie.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    }catch(err){
        res.status(404).json({
            status:"fail",
            message: err.message
        });
    }
}


/*
SORTING
the url is 127.0.0.1:3000/api/v1/movies
127.0.0.1:3000/api/v1/movies/?sort=price asc
127.0.0.1:3000/api/v1/movies/?sort=-price desc
*/

exports.getMovies=async (req,res)=>{
    try{
        
        //We initially store the movies in a query object since sort can only be used on query objects
        //let query = Movie.find(req.query);
        //In the below query is a result since it is the result of a promise
        //We cant use Mongo sort command on a result only on query hence this method
        //let query =  await movies.find(req.query);
        let query =  movies.find(req.query);

        if(req.query.sort){
            const sortBy=req.query.sort.split(',').join(' ')
            query=query.sort(req.query.sort)
        
        }else{
            query=query.sort('-createdAt')
        }

        const movies=await query;
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




/*
LIMITING FIELDS
the url is 127.0.0.1:3000/api/v1/movies
127.0.0.1:3000/api/v1/movies/?fields=name,director,price
// we only want those fields

127.0.0.1:3000/api/v1/movies/?fields=-name,-director,-price
// we only want all fields except those 3 those fields


we cant do inclusion and exclusion in one query string together
127.0.0.1:3000/api/v1/movies/?fields=-name,-director,+price
127.0.0.1:3000/api/v1/movies/?fields=-name,+director,-price

we can make a property itself to be invisble by having the property select:false in the schema
*/

exports.getMovies=async (req,res)=>{
    try{
        
        //We initially store the movies in a query object since sort can only be used on query objects
        //let query = Movie.find(req.query);
        //In the below query is a result since it is the result of a promise
        //We cant use Mongo sort command on a result only on query hence this method
        //let query =  await movies.find(req.query);
        let query =  movies.find(req.query);

        if(req.query.fields){
            // wecan many fields in query select we split all of them based in , 
            // A single string of fields to it gives an array 
            //then we join all of them by removing  ' '
            const fields=req.query.fields.split(',').join(' ')
            query =query.select(fields)
        
        }else{
            query=query.fields('-__v')
        }

        const movies=await query;
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


//PAGINATION
//the url is 127.0.0.1:3000/api/v1/movies
//127.0.0.1:3000/api/v1/movies/?page=2&limit=10
exports.getMovies=async (req,res)=>{
    try{
        
        //We initially store the movies in a query object since sort can only be used on query objects
        //let query = Movie.find(req.query);
        //In the below query is a result since it is the result of a promise
        //We cant use Mongo sort command on a result only on query hence this method
        //let query =  await movies.find(req.query);
        let query =  movies.find(req.query);

        if(req.query.fields){
            // wecan many fields in query select we split all of them based in , 
            // A single string of fields to it gives an array 
            //then we join all of them by removing  ' '
            const fields=req.query.fields.split(',').join(' ')
            query =query.select(fields)
        
        }else{
            query=query.fields('-__v')
        }


        const page=req.query.page ||1
        const limit=req.query.limit ||10
        const skip=(page-1)*limit
        query=query.skip(skip).limit(limit)

        if(req.query.page){
            //countDocuments() returns a promise so we await
            const moviesCount=await Movie.countDocuments()
            if(skip>=moviesCount){
                throw new Error("This page is not found")
            }
        }

        const movies=await query;
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