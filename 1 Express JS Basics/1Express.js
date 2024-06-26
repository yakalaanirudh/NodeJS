//IMPORT PACKAGE

const express = require('express');         //require returns a function we are assigning it to variable named express
let app = express();

//ROUTE=HTTP METHOD+URL
/*
app.get('/',(req,res)=>{
    res.status(200).send("Hello from express server")
})
*/

//When we access / url with get method this response will be sent
//To set status code chain it with status(code)
//When we use send the content type is set by default as text/html
app.get('/',(req,res)=>{
    res.status(200).send('<h4>Hello from express server<h4>')
})

//If we want to send json as response and now the content type will be application/json
app.get('/',(req,res)=>{
    res.status(200).json({"message":"Hello World","Star":"Sun"})
})

//The below route will be executed whenever we make a  post request to / url
app.post('/',()=>{
    
})


//Create a server
const port=3000
//The callback function will be executed the moment server starts
app.listen(port,()=>{
    console.log('Server has started...')
})

