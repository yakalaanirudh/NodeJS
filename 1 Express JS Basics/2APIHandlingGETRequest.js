//IMPORT PACKAGE

const express = require('express');         //require returns a function we are assigning it to variable named express
let app = express();

let fs=require('fs')
let movies=JSON.parse(fs.readFileSync('./data/movies.json'))

//GET -api/movies
//Here since we are using api we include api in urla dn also its version
app.get('api/v1/movies',(req,res)=>{
    res.status(200).json({
        status:"success",
        count:movies.length,
        data:{
            movies:movies
        }
    })
})



//Create a server
const port=3000
//The callback function will be executed the moment server starts
app.listen(port,()=>{
    console.log('Server has started...')
})

/*
JSON.parse()
JSON.parse() is used to convert a JSON string into a JavaScript object. 
This is typically used when you receive JSON data from an external source, 
such as an API or local storage, and you need to work with it in your JavaScript code.

When you receive data from an external source like an API, 
the data is often sent in the form of a JSON string. 
To work with this data in your JavaScript code, you need to convert it into a JavaScript object. 
This is where JSON.parse() comes in.

JSON.stringify()
JSON.stringify() is used to convert a JavaScript object into a JSON string. 
This is useful when you need to send data to an external source that requires JSON format, 
such as an API or local storage.

When you need to send data to an external source like an API, 
the data needs to be in a format that can be transmitted over the internet, typically a JSON string. 
To convert your JavaScript object into a JSON string, you use JSON.stringify().

*/
