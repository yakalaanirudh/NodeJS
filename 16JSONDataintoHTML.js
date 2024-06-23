const http = require('http');
const html = fs.readFilesync('./Template/index.html','utf-8')
let products=JSON.parse(fs.readFilesync('./Data/products.json','utf-8'))            //Data file parsed
let productsListHtml=JSON.parse(fs.readFilesync('./Template/products-list.html','utf-8'))       //Html file parsed

//Here we are replacing the HTML content with data
let productHTMLArray=products.map((product)=>{
    let output = productListHtml.replace('{{%NAME%}}', product.name);
    output = output.replace('{{%MODELNAME%}}', product.modeName);
    output = output.replace('{{%MODELNO%}}', product.modelNumber);
    output = output.replace('{{%SIZE%}}', product.size);
    output = output.replace('{{%CAMERA%}}', product.camera);
    output = output.replace('{{%PRICE%}}', product.price);
    output = output.replace('{{%COLOR%}}', product.color);
    output = output.replace('{{%ID%}}', product.id);
    output = output.replace('{{%ROM%}}', product.ROM);
    output = output.replace('{{%DESC%}}', product.Description);

    return output
})

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

        //Since the data is an an array it is seperated by commas
        //Join the arrays content by commas so we return a single value
        let productResponseHtml=html.replace('{{%CONTENT}}',productHtmlArray.join(',')) 
        response.writeHead(200,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        response.end(productResponseHtml)
        //console.log(products)       //The data logged as an array of JS Objects
    }else{                      
        //For any other routes default route is page not found
        response.writeHead(404,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        response.end(html.replace('{{%CONTENT%}}','Error 404:Page not found'))
    }
})