const http = require('http');

const server=http.createServer((request,response)=>{
    let path=request.url

    if (path==='/' || path.toLowercase()==='/home'){
        response.end("You are in home page")
    }else if (path.toLowercase()==='/about'){
        response.end("You are in about page")
    }else if (path.toLowercase()==='/contacts'){
        response.end("You are in contacts page")
    }else{                      //For any other routes default route is page not found
        response.end("Error 404:Page not found")
    }
})


let buttonEl=document.getElementById("ButtonEl")
buttonEl.addEventListener("Onclick",somefunction)