let fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))

exports.checkId=(req,res,next,value)=>{

    console.log("Movie ID is "+value)

    const movie=movies.find((movie)=>movie.id===id*1)
    if(!movie){
        return res.status(404).json({
            status:"failure",
            message:"Movie with id "+id+" not found."
        })
    }
    next()
}


exports.getAllMovies=(req,res)=>{
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,            //The time from the middleware
        count:movies.length,
        data:{
            movies:movies
        }
    })
}

exports.getSingleMovie=(req,res)=>{

    //We are converting the id which is in string format to number
    const id =req.params.id*1

    //Find the movie
    const movie=movies.find((movie)=>movie.id===id)

    //Inside we are using return because if movie is not there and we dont return
    //It will also send a response from the below 200 status code block
    if(!movie){
        return res.status(404).json({
            status:"failure",
            message:"Movie with id "+id+" not found."
        })
    }

    res.status(200).json({
        status:"success",
        data:{
            movie:movie
        }
    })
}


exports.deleteMovie=(req,res)=>{

    //We are converting the id which is in string format to number
    const id =req.params.id*1

    //Find the movie
    const movieToDelete=movies.find((movie)=>movie.id===id)

    //Inside we are using return because if movie is not there and we dont return
    //It will also send a response from the below 200 status code block
    if(!movieToDelete){
        return res.status(404).json({
            status:"failure",
            message:"Movie with id "+id+" not found."
        })
    }

    const index=movies.indexOf(movieToDelete)       //id=4 index=3

    movies.splice(index,1)



    fs.writeFile('./data.movies.json',JSON.stringify(movies),(err)=>{
        res.status(204).json({
            status:"success",
            data:{
                movie:null
            }
        })
    })

}


exports.updateMovie=(req,res)=>{

    //We are converting the id which is in string format to number
    const id =req.params.id*1

    //Find the movie
    const movieToUpdate=movies.find((movie)=>movie.id===id)

    //Inside we are using return because if movie is not there and we dont return
    //It will also send a response from the below 200 status code block
    if(!movieToUpdate){
        return res.status(404).json({
            status:"failure",
            message:"Movie with id "+id+" not found."
        })
    }

    const index=movies.indexOf(movieToUpdate)       //id=4 index=3

    Object.assign(movieToUpdate,req.body)       //We have the movie to update and we rewrite teh property to patch
    movies[index]=movieToUpdate



    fs.writeFile('./data.movies.json',JSON.stringify(movies),(err)=>{
        res.status(200).json({
            status:"success",
            data:{
                movie:movieToUpdate
            }
        })
    })

}

exports.createMovie=(req,res)=>{

    const newId=movies[movies.length-1].id+1;
    //Now body has reuest body data
    const newMovie=Object.assign({id:newId},req.body)
    movies.push(newMovie);

    fs.writeFile('./data.movies.json',JSON.stringify(movies),(err)=>{
        res.status(201).json({
            status:"success",
            data:{
                movies:newMovie
            }
        })
    })
    //res.send('Created')
}
