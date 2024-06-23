//In this we create a function that populates productlist and product information

const http = require('http');
const html = fs.readFilesync('./Template/index.html','utf-8')
let products=JSON.parse(fs.readFilesync('./Data/products.json','utf-8'))
let productsListHtml=JSON.parse(fs.readFilesync('./Template/products-list.html','utf-8'))
const url =require('url')
let productDetailHtml = fs.readFileSync('./Template/product-details.html', 'utf-8');


//The below is userdefined module
//A module is another script file that can exported or imported
const  replaceHtml = require('./Modules/replaceHtml');

/*
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
*/

const server=http.createServer((request,response)=>{
    //let x=url.parse(request.url,true)     //true it will parse query string from url if false it wont parse query string from url
    let {query,pathname:path}=url.parse(request.url,true)
    //let path=request.url

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
        //If the url has no query parameters execute this
        if(!query.id){
        //fs.readfilesync('./Data.products.json','utf-8',(error,data)=>{console.log(products)}

        //Since the data is an an array it is seperated by commas
        //Join the arrays content by commas so we return a single value
        //let productResponseHtml=html.replace('{{%CONTENT}}',productHtmlArray.join(',')) 
        let productHTMLArray=products.map((prod)=>{return replaceHtml(productListHtml,prod)})
        response.writeHead(200,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        let productResponseHtml=html.replace('{{%CONTENT}}',productHtmlArray.join(',')) 
        response.end(productResponseHtml)
        //console.log(products)       //The data logged as an array of JS Objects
        }else{
        //response.end("This is a product with ID =" + query.id)
            let prod = products[query.id]
            let productDetailResponseHtml = replaceHtml(productDetailHtml, prod);
            response.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));
    }
    }else{                      
        //For any other routes default route is page not found
        response.writeHead(404,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
        response.end(html.replace('{{%CONTENT%}}','Error 404:Page not found'))
    }
})