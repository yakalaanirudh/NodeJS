/*
UNDERSTANDING EVENT DRIVEN ARCHITECTURE
In an event driven architecture
server is the event emitter
server.on on is the event listener
teh callback function inside on is event handler
*/


//SERVER INHERITS FROM EVENTEMITTER
const server = http.createServer();
//To the event handler function the request is passed as parameter along woth the response
server.on('request', (request, response) => {
    //pathname is stored in path and quer srings are stored in query
    let {query, pathname: path} = url.parse(request.url, true)      
    console.log(x);
     path = request.url;
    
    if(path === '/' || path.toLocaleLowerCase() ==='/home'){
        response.writeHead(200, {
            'Content-Type' : 'text/html',
            'my-header': 'Hellow, world'
        });
        response.end(html.replace('{{%CONTENT%}}', 'You are in Home page'));
    } else if(path.toLocaleLowerCase() === '/about'){
        response.writeHead(200, {
            'Content-Type' : 'text/html',
            'my-header': 'Hellow, world'
        });
        response.end(html.replace('{{%CONTENT%}}', 'You are in About page'));
    } else if(path.toLocaleLowerCase() === '/contact'){
        response.writeHead(200, {
            'Content-Type' : 'text/html',
            'my-header': 'Hellow, world'
        });
        response.end(html.replace('{{%CONTENT%}}', 'You are in Contact page'));
    } else if(path.toLocaleLowerCase() === '/products'){
        if(!query.id){
            let productHtmlArray = products.map((prod) => {
            return replaceHtml(productListHtml, prod);
        })
        let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(','));
        response.writeHead(200, {'Content-Type': 'text/html' });
        response.end(productResponseHtml);
        } else {
            let prod = products[query.id]
            let productDetailResponseHtml = replaceHtml(productDetailHtml, prod);
            response.end(html.replace('{{%CONTENT%}}', productDetailResponseHtml));
        }
    } else {
    response.writeHead(404, {
        'Content-Type' : 'text/html',
        'my-header': 'Hellow, world'
    });
    response.end(html.replace('{{%CONTENT%}}', 'Error 404: Page not found!'));
    }
})

//STEP 2: START THE SERVER
server.listen(8000, '127.0.0.1', () => {
console.log('Server has started!');
})
