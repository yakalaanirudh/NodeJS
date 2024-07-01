const express = require('express');         //require returns a function we are assigning it to variable named express
let app = express();
let morgan =require('morgan')
const moviesRouter=require('./Routes/moviesRoutes')

let fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))

//Every middleware takes 3 paramet ers req,res and next() function
//To use a middleware we use use() function
const logger=function(req,res,next){
    console.log('Custom middleware called')
    next()                  //next() must be used at end of middleware to send output to next middleware
}

app.use('api/v1/movies',moviesRouter)

module.exports=app