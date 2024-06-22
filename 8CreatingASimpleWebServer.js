//LECTURE 8:
//CREATING A SIMPLE WEB SERVER
const readline = require('readline');
const fs = require('fs');
const http = require('http');   //To create server we need to import http

//Create a server
//Everytime we receive a new request this message will be executed
const htmlpage=fs.readFileSync('./Template/index.html','utf-8')
const server=http.createServer((request,response)=>{
    response.end("Hello from the server")       //This is the response that will be sent
    response.end(<p>Hello Prince Vegeta!!!</p>) //Sending HTML as response
    response.end(htmlpage)                      //Sending html file as response
    console.log("A new request received")
    console.log(request)
    console.log(response)
})

//Start a server
//8000 is port number
//127.0.0.1 is the url path
server.listen(8000,'127.0.0.1',()=>{
    console.log("Server has started")
})

/*
Lets say a server at path "192.168.20.134"
Node at 8000 port   
Java at 4000 port
.NET at 3000 port

DNS -Domain Name Server
The browser initially makes a request to the DNS to know the IP address of the path we typed in the browser
the ip address for google.com

Suppose we send  arequest for  a home page
The server send sthe homepage html and it also send links for the CSS and JS files
The server again sends requests to fetch these files and gets the responses

Lets say the html page we sent has css and js files
So for the requests to fetch these css and js files the initiatior is the html file
*/