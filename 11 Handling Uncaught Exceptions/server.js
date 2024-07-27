const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const mongoose = require('mongoose');
const app = require('./app');

/*
All the synchronous errors that we encounter that we dont handle are called exceptions
like console.log(x)
The below handles all the uncaught exceptions
Whenever we encounter an unhandledRejection
we listen to the unhandledRejection 

This is placed at the start so that any uncaught exceptions wont be parsed before parsing the uncaughtException handler code
*/

/*
Suppose the same synchronous exception
console.log(x) is placed in some middleware then
the uncaughtException handler will not be called 
but it will be handled by globalexception handler since it handles exceptions in express
and middleware is part of express

*/

process.on('uncaughtException', (err) => {
    console.log(err.name, err.message);
    console.log('Uncaught Exception occured! Shutting down...');
    process.exit(1);
})


//console.log(app.get('env'));
console.log(process.env);

mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    //console.log(conn);
    console.log('DB Connection Successful');
})/*.catch((error) => {
    console.log('Some error has occured');
});
*/
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server has started...');
})

//The global error handler handles inly errors related to express js
//It does not handle errors related to mongoose or other modules
//To handle any connection with server issues we so the below
//we commented the catch block from connect
//Whenever we encounter an unhandledRejection
//we listen to the unhandledRejection 
process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('Unhandled rejection occured! Shutting down...');
 
    //Clsoe the server
    //After closing the server exit the process
    server.close(() => {
     process.exit(1);
    })
 })
 

