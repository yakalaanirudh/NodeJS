
const app=reuire('./app')

const port=3000
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