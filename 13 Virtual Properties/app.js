//IMPORT PACKAGE
const { application } = require('express');
const express = require('express');
const morgan = require('morgan');
const moviesRouter = require('./Routes/moviesRoutes');

//This line initializes an Express application instance named app. Express is a web application framework for Node.js that simplifies the process of building APIs and web applications.
let app = express();    

const logger = function(req, res, next){
    console.log('Custom middleware called');
    next();
}

//This enables us to pass req.body to functions inside app
app.use(express.json());

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(express.static('./public'))
app.use(logger);
app.use((req, res, next) => {
    req.requestedAt = new Date().toISOString();
    next();
})

//USING ROUTES
app.use('/api/v1/movies', moviesRouter)

module.exports = app;

