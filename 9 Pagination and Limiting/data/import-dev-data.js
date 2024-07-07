const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Movie = require('./../Models/movieModel');

//import and configure the configuration file 
dotenv.config({path: './config.env'});

//CONNECT TO MONGODB
/*
the useNewUrlParser: true option 
is passed within the second argument of mongoose.connect, which is an options object. 
This ensures that Mongoose uses the new URL string parser when connecting to the MongoDB database, 
leading to a more stable and future-proof connection.
*/
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then((conn) => {
    console.log('DB Connection Successful');
}).catch((error) => {
    console.log('Some error has occured');
});

//READ MOVIES.JSON FILE
const movies = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));

//DELETE EXISTING MOVIE DOCUMENTS FROM COLLECTION
const deleteMovies = async () => {
    try{
        await Movie.deleteMany();
        console.log('Data successfully deleted!');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

//IMPORT MOVIES DATA TO MONGODB COLLECTION
// we are m=passing movies as argument to create to create multiple dcouments at once in the movies collection
const importMovies = async () => {
    try{
        await Movie.create(movies);
        console.log('Data successfully imported!');
    }catch(err){
        console.log(err.message);
    }
    process.exit();
}

/*
importMovies()
deleteMovies()
*/

/*
//console.log(process.argv)
//node data/import-dev-data.js we are  running this file

*/
/*
we will get two lines
The first is where the node command is located (or where node js is running)
the second is where the current script whether import of delete is running this file
this import or deleteMovies function will be the third argument in the process.argv object
3rd argument means index 2
so when we runthis file 
if third argument is --import run importMovies()
if third argument is --delete run deleteMovies()
*/

/*
This is how we run the script
node data/import-dev-data.js --import 
or
node data/import-dev-data.js --import 
*/
if(process.argv[2] === '--import'){
    importMovies();
}
if(process.argv[2] === '--delete'){
    deleteMovies();
}