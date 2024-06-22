//When we send HTML response with script and js files in it
//Node js wont load them because node js cant run static files
//So we write the styles and script in style and script tag inside the html file


const http = require('http');
const html = fs.readFilesync('./Template/index.html','utf-8')

const server=http.createServer((request,response)=>{
    let path=request.url

    if (path==='/' || path.toLowercase()==='/home'){
        response.end(html.replace('{{%CONTENT%}}','You are in Home Page'))
    }else if (path.toLowercase()==='/about'){
        response.end(html.replace('{{%CONTENT%}}','You are in About Page'))
    }else if (path.toLowercase()==='/contacts'){
        response.end(html.replace('{{%CONTENT%}}','You are in Contacts Page'))
    }else{                      //For any other routes default route is page not found
        response.end(html.replace('{{%CONTENT%}}','Error 404:Page not found'))
    }
})

/*
replace('{{%CONTENT%}}','You are in Home Page')

This means we are replacing the text inside the HTML page
'{{%CONTENT%}}'
with the second argument
'You are in Home Page'

*/