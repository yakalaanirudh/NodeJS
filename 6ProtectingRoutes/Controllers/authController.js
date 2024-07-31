const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');  //To handle the rejected promise
const jwt=require('jsonwebtoken')
const customError=require('./../Utils/CustomError');
const CustomError = require('./../Utils/CustomError');
const util=require('util')


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


//This is the middleware function to make some routes protected
exports.protect=asyncErrorHandler(async(req,res,next)=>{
    //1.Read the token and check if it exists
    /*
    All authorization headers value must start with word bearer header:{authorization:bearer JWTValue}
    */

    const testToken=req.header.authorization
    let token

    if(testToken && testToken.startsWith('bearer')){
        token=testToken.split(' ')[1]       //get the second part of value as first is bearer
    }

    if(!token){
        next(new CustomError('You are not logged in!',401))
    }

    //2.Validate the token
    /*
    jwt has verify function to verify the token with the token on server SECRET_STR
    The function runs async but doesnt return a promise
    So to promisfy the function we import utils.promisify and wrap the function name in ()
    If the JWT has expired or JWT is tampered we will handle those errors with handleExpiredJWT handleJWTError
    in errorController
    The decodedToken has id, when JWT created at at when the JWT expires
    */
    //jwt.verify(token, process.env.SECRET_STR)
    const decodedToken =await util.promisify(jwt.verify)(token, process.env.SECRET_STR)

    //3.Check if the user exits(Lets say user logins and immediately gets deleted)
    const user=await User.findById(decodedToken.id) //In user collection find user by ID

    if(!user){
        const error=new CustomError('The user with the given token does not exist',401)
        next(error)
    } 

    //4.Check if user changes password after token issued, we need to login after password change
    //decodedToken.iat in the decodedToken iat stands for when JWT issued at
    if(await user.isPasswordChanged(decodedToken.iat)){
        const error=new CustomError(`Password changed recently. Please login again.`,401)
        next(error)
    }

    //5.Allow user to access the route
    next()              //Go to the next middleware

})

//We install JSON we Token to send tokens in the repsonse