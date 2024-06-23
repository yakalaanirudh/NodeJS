const http = require('http');
const html = fs.readFilesync('./Template/index.html','utf-8')
let products=JSON.parse(fs.readFilesync('./Data/products.json','utf-8'))
let productsListHtml=JSON.parse(fs.readFilesync('./Template/products-list.html','utf-8'))
const url =require('url')

//Here we are replacing the HTML content with data and we are doing it for all products in product list
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
        if(!query.id){
        //fs.readfilesync('./Data.products.json','utf-8',(error,data)=>{console.log(products)}

        //Since the data is an an array it is seperated by commas
        //Join the arrays content by commas so we return a single value
        //Here we are replacing the content in index HTML with the product array single value returned by join
        let productResponseHtml=html.replace('{{%CONTENT}}',productHtmlArray.join(',')) 
        response.writeHead(200,{
            'Content-type':'text/html',
            'my-header':'Hello World'
        })
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