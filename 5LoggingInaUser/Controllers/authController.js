const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');  //To handle the rejected promise
const jwt=require('jsonwebtoken')
const customError=require('./../Utils/CustomError')


const signToken=id=>{
    return jwt.sign({id:id},process.env.SECRET_STR,{
    expiresIn:process.env.LOGIN_EXP
    })
}

//It returns a promise
exports.signup = asyncErrorHandler(async (req, res, next) => {
    //create a new user with the user Schema and applying create method on it
    const newUser = await User.create(req.body);

    //This is teh token
    //It takes two arguments the first is the payload
    //The second is the secret key
    //We can add additional argumentsblike whn the token expires after duration
    /*
    const token=jwt.sign({id:newUser.id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXP
    })
    */

    const token=signToken(newUser._id)
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login=asyncErrorHandler(async (req,res,next)=>{
    const email=req.body.email;
    const password=req.body.password

    //Or we can also fetch them by object destructuring
    //const {email,password}=req.body

    //check if password and email are present in req body
    if(!email ||!password){
        const error=new customError('Please provide email and password',400)
        return next(error)
    }

    //check if user with that password exists in the database
    //.select('+password'): This method specifies which fields should be included or excluded in the query result. 
    //In Mongoose, by default, certain fields (like passwords) are not included in query results for security reasons. 
    //The +password syntax explicitly tells Mongoose to include the password field in the result.
    const user=await User.findOne({email:email}).select('+password')

    //const isMatch=await User.comparePasswordInDB(password,user.password)


    //Check if user exits and password is matching
    /*if(!user || !isMatch){
        const error=new CustomError('!Incorrect email or password',400)
        return next(error)
    }
    */
    //If user is not there we will get undefined and it will create an exception in isMatch

    //User.comparePasswordInDB(password,user.password) (password we sent in req,passwordin DB)
    if(!user || !(await User.comparePasswordInDB(password,user.password))){
        const error=new CustomError('!Incorrect email or password',400)
        return next(error)
    }

    //Below user._id is the id for the user we fetched from the user we find by User.findOne
    const token=signToken(user._id)

    res.status(200).json({
        status:'success',
        token
    })
})


//We install JSON we Token to send tokens in the repsonse