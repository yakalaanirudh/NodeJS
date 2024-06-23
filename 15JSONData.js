const http = require('http');
const html = fs.readFilesync('./Template/index.html','utf-8')
let products=JSON.parse(fs.readFilesync('./Data/products.html','utf-8'))

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
    }else if (path.toLowercase()==='/products'){
        //fs.readfilesync('./Data.products.json','utf-8',(error,data)=>{console.log(products)}
        response.writeHead(200,{
            'Content-type':'application/json',
            'my-header':'Hello World'
        })
        response.end('You are in products page')
        console.log(products)       //The data logged as an array of JS Objects
    }else{                      
        //For any other routes default route is page not found
        response.writeHead(404,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        response.end(html.replace('{{%CONTENT%}}','Error 404:Page not found'))
    }
})

/*
If we read the products file for every request we slow the application
So we read the products file initially once and store it in the products variable after parsing it

*/

/*
}else if (path.toLowercase()==='/products'){
        //fs.readfilesync('./Data.products.json','utf-8',(error,data)=>{console.log(products)}
            response.writeHead(200,{
                'Content-type':'application/json',
                'my-header':'Hello World'
            })
            response.end('You are in products page')
            console.log(products)
        }
 */