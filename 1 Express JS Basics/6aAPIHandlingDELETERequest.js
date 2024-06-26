//IMPORT PACKAGE

//Route parameters are named URL segments that are used to
//capture the values specified at their position in the URL
//127.0.0.1:3000/api/v1/movies/:id  id is the route parameter
const express = require('express');         //require returns a function we are assigning it to variable named express
let app = express();

let fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))

//express.json() is a middleware
app.use(express.json())     //We use this because by default express doesnt pass request body to the request in POST Method


//GET -api/movies
//Here since we are using api we include api in url and also its version
app.get('api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
    })
})

//POST -api/movies
app.post('api/v1/movies',(req,res)=>{

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
})

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

app.get('api/v1/movies/:id',(req,res)=>{

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
})

//PUT/PATCH -api/v1/movies/id
/*
PUT vs PATCH
PUT is a method of modifying resource where the client sends data that updates the entire resource .
PATCH is a method of modifying resources where the client 
sends partial data that is to be updated without modifying the entire data.

*/


app.patch('api/v1/movies/:id',(req,res)=>{

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

})


//DELETE -api/v1/movies/id
app.delete('api/v1/movies/:id',(req,res)=>{

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

})


//Create a server
const port=3000
//The callback function will be executed the moment server starts
app.listen(port,()=>{
    console.log('Server has started...')
})