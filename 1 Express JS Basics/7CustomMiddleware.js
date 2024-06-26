//IMPORT PACKAGE

//Route parameters are named URL segments that are used to
//capture the values specified at their position in the URL
//127.0.0.1:3000/api/v1/movies/:id  id is the route parameter
const express = require('express');         //require returns a function we are assigning it to variable named express
let app = express();

let fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))

//Every middleware takes 3 parameters req,res and next() function
//To use a middleware we use use() function
const logger=function(req,res,next){
    console.log('Custom middleware called')
    next()                  //next() must be used at end of middleware to send output to next middleware
}


/*
use logger()                //Here logger is applied to all routes below
app.route('api/v1/movies')
.get(getAllMovies)
.post(createMovie)

//If route is 'api/v1/movies/:id' it will come here then select the subroute based on the HTTP method
app.route('api/v1/movies/:id')
.get(getSingleMovie)
.patch(updateMovie)
.delete(deleteMovie)
*/

/*

app.route('api/v1/movies')
.get(getAllMovies)
.post(createMovie)

//Here logger middleware is applied to only the routes below and not above
use logger()  
//If route is 'api/v1/movies/:id' it will come here then select the subroute based on the HTTP method
app.route('api/v1/movies/:id')
.get(getSingleMovie)
.patch(updateMovie)
.delete(deleteMovie)

*/

//express.json() is a middleware
app.use(express.json())     //We use this because by default express doesnt pass request body to the request in POST Method
app.use(logger)
//Below we are creating a new middleware to add time when request was made
app.use((req,res,next)=>{
    req.requestedAt=new Date().toISOString()
    next()

})

//ROUTE HANDLER FUNCTION

const getAllMovies=(req,res)=>{
    res.status(200).json({
        status:"success",
        requestedAt:req.requestedAt,            //The time from the middleware
        count:movies.length,
        data:{
            movies:movies
        }
    })
}

const getSingleMovie=(req,res)=>{

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


const deleteMovie=(req,res)=>{

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


const updateMovie=(req,res)=>{

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

const createMovie=(req,res)=>{

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

//GET -api/movies
//Here since we are using api we include api in url and also its version
app.get('api/v1/movies',getAllMovies)

//POST -api/movies
app.post('api/v1/movies',createMovie)

//GET -api/v1/movies/id   

/*
//The params has the query id in an object structure
//Now in browser if we type localhost/api/v1/movies/3
//In console it will be logged {id:'3'} The params will be always in String format
//In response we will get Test movie
app.get('api/v1/movies/:id',(req,res)=>{
console.log(req.params)
res.send('Test movie')
})

//Now in browser if we type localhost/api/v1/movies/3/LOTR/2004
//In console it will be logged {id:'3',name:'LOTR',year:'2004'}
//In response we will get Test movie
app.get('api/v1/movies/:id/:name/:year',(req,res)=>{
    console.log(req.params)
    res.send('Test movie')
})

//we will get an error if we do not pass all params in the url
//so to prevent thsi we can use ?
'api/v1/movies/:id/:name?/:year?'       Here year and name are optional
{id:'3',name:undefined,year:undefined}  //if we do not pass the values
app.get('api/v1/movies/:id/:name/:year',(req,res)=>{
    console.log(req.params)
    res.send('Test movie')
})
*/    

app.get('api/v1/movies/:id',getSingleMovie)

//PUT/PATCH -api/v1/movies/id
/*
PUT vs PATCH
PUT is a method of modifying resource where the client sends data that updates the entire resource .
PATCH is a method of modifying resources where the client 
sends partial data that is to be updated without modifying the entire data.

*/


app.patch('api/v1/movies/:id',updateMovie)


//DELETE -api/v1/movies/id
app.delete('api/v1/movies/:id',deleteMovie)


//CHAINING THE METHODS
//If route is 'api/v1/movies' it will come here then select the subroute based on the HTTP method
app.route('api/v1/movies')
.get(getAllMovies)
.post(createMovie)

//If route is 'api/v1/movies/:id' it will come here then select the subroute based on the HTTP method
app.route('api/v1/movies/:id')
.get(getSingleMovie)
.patch(updateMovie)
.delete(deleteMovie)

//Create a server
const port=3000
//The callback function will be executed the moment server starts
app.listen(port,()=>{
    console.log('Server has started...')
})

/*
Difference between these two

app.delete('api/v1/movies/:id',deleteMovie)
app.delete('api/v1/movies/:id',()=>deleteMovie())

Invocation Time:

In the first snippet, deleteMovie is only called 
when a DELETE request is made to the specified route.
In the second snippet, deleteMovie() is called immediately 
when the route is set up, not when a request is made.

Arguments Passed:

In the first snippet, deleteMovie receives the req and res objects 
as arguments when invoked by the Express.js router.
In the second snippet, since deleteMovie() is called immediately without any arguments, 
it won't receive req and res unless the function is designed to handle it differently.
*/