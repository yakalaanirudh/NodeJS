const express = require('express');         //require returns a function we are assigning it to variable named express
let app = express();
let morgan =require('morgan')
const moviesRouter=require('./Routes/moviesRoutes')

let fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))


//The below static is used to send static files
//Inside we enter the path wher ethe static files are stored
//When we type the url in the browser type the file path removing the folder where static files are stored
//In this case public
//Because when express cant find the url it will look inside the folder mentioned in the static function
app.use(express.static('./public'))

//Every middleware takes 3 paramet ers req,res and next() function
//To use a middleware we use use() function
const logger=function(req,res,next){
    console.log('Custom middleware called')
    next()                  //next() must be used at end of middleware to send output to next middleware
}

app.use('api/v1/movies',moviesRouter)

module.exports=app