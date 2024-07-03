

const dotenv=require('dotenv')          //This should be before app 

//Pass the path of teh config file
dotenv.config({path:'./config.env'})    //This should be before app 

const app=require('./app')

//The below logs the current environment
console.log(app.get('env'))
//console.log(process.env)      //We will get environment variables set by node js

//const port=3000
const port=process.env.PORT ||3000
//The callback function will be executed the moment server starts
app.listen(port,()=>{
    console.log('Server has started...')
})

//From now on we will run the process by
//not running app.js 
//but
//server.js

//In package.json file in scripts we can add a comment to start running this by running server.js instead of app.js

/*
"scripts":{
"start":"nodemon server.js"}
*/
//Now we can run this by npm start



/*
Two most important environments are production and development environments
By default express sets envionment to development
Environment variables are global variables to determine in which environment the app is running

*/

/*
We can set environement VAriables from command prompt
SET NODE_ENV=development

we can also set OTHER ENVIRONMENT VARIABLES variables
SET X=7
SET Y=18

*/