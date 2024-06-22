//200 is default status code for response


const http = require('http');
const html = fs.readFilesync('./Template/index.html','utf-8')

const server=http.createServer((request,response)=>{
    let path=request.url

    if (path==='/' || path.toLowercase()==='/home'){
        response.writeHead(200,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        response.end(html.replace('{{%CONTENT%}}','You are in Home Page'))
    }else if (path.toLowercase()==='/about'){
        response.writeHead(200,{
            'Content-type':'text/html',
            'my-header':'Hello World' 
        })
        response.end(html.replace('{{%CONTENT%}}','You are in About Page'))
    }else if (path.toLowercase()==='/contacts'){
        response.writeHead(200,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        response.end(html.replace('{{%CONTENT%}}','You are in Contacts Page'))
    }else{                      //For any other routes default route is page not found
        response.writeHead(404,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        response.end(html.replace('{{%CONTENT%}}','Error 404:Page not found'))
    }
})


/*
HEADERS MUST BE BEFORE RESPONSE
response.writeHead(200,{
    'Content-type':'text/html',
    'my-header':'Hello World'
})
response.writehead is used to write header
 200 is the status code
 the second argument a object with key value pairs is for header
 my-header is the custom header

 "my-header" we wrapped it in quotes because in JS if we have special characters in key we enclose in ""

*/