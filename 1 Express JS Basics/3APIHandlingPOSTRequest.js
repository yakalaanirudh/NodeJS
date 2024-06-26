//IMPORT PACKAGE

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

    fs.writeFile('./data.movies.json',JSON.stringify(movies),err=>{
        res.status(201).json({
            status:"success",
            data:{
                movies:newMovie
            }
        })
    })
    //res.send('Created')
})





//Create a server
const port=3000
//The callback function will be executed the moment server starts
app.listen(port,()=>{
    console.log('Server has started...')
})
