const mongoose=require('mongoose')
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const app = require('./app');

//console.log(app.get('env'));
console.log(process.env);

//In the below we are connecting to ATlas server using connection from config file
//If successful we console.log it if fail we log the error message
mongoose.connect(process.env.CONN_STR,{
    useNewUrlParse:true
}).then ((conn)=>{
    console.log(conn)
    console.log(" DB Connection Successful")
}).catch((error)=>{
    console.log("Some error occurred")
})

/*
const movieSchema=new mongoose.Schema({
    name:String,
    description:String,
    duration:Number,
    ratings:Number
})
*/

const movieSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is a required field'],
        unique:true
    },
    description:String,
    duration:{
        type:Number,
        //The second argument is the error message that will be displayed that duration is required
        required:[true,'Duration is a required field']   
    },
    ratings:{
        type:Number,
        default:1.0
    }
})

const Movie=mongoose.model('Movie',movieSchema)

//The below creates a movie named testMovie based on above schema
const testMovie=new Movie({
    name:"Avengers",
    description:"Superhero movie",
    duration:180,
    ratings:4.2
})

//The created movie is saved in the database if it doesnt an error is logged
testMovie.save().then((doc)=>{
    console.log(doc)
}).catch(err=>console.log("error Ocurred"+err));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('server has started...');
})