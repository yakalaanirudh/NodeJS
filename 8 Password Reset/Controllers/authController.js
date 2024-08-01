const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');  //To handle the rejected promise
const jwt=require('jsonwebtoken')
const customError=require('./../Utils/CustomError');
const CustomError = require('./../Utils/CustomError');
const util=require('util')
const sendEmail=require('./../Utils/email')


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
    req.user=user       //We are adding a property named user to request object and assigning it value user
    next()              //Go to the next middleware

})

//To a middleware function we cant pass an argument directly except req,res and next
//So we wrap the middleware function in another function (role)=>{return middleware function}
//The role in wrapper function is passed from the roles in moviesRoutes.js
exports.restrict=(role)=>{
    return (req,res,next)=>{
        if(req.user.role!==role){       //If role in request is not role from wrapper function  error
            const error=new CustomError(`You do not have permission to perform this action.`,403)
            next(error)
        }

        next()      //else get to next middleware delete middleware
    }
}

//If more than one role can delete the we expand all roles by rest operator ...
exports.restrict=(...role)=>{
    return (req,res,next)=>{
        if(!role.includes(req.user.role)){      //If the role is not in req.user then error
            const error=new CustomError(`You do not have permission to perform this action.`,403)
            next(error)
        }

        next()
    }
}

//When we forgot  a password
//  STEP 1  User sends a POST request to forgot password route only with his email address.
//The user then sends a POST request to reset password with the new password and the token sent to his email.


exports.forgotPassword=(req,res,next)=>{}

    //STEP 1 GET USER BASED ON POSTED EMAIL
    const user=await User.findOne({email:req.body.email})

    if(!user){
        const error=new CustomError(`We could not find the user with the given email.`,404)
        next(error)
    }

    //STEP 2 GENERATE A RANDOM RESET TOKEN
    const resetToken=user.createResetPasswordToken()        //Get token
    // we do not want to run any validation before saving
    await user.save({validateBeforeSave:false})           //save token and expiry tiem in the schema without validation


    //STEP 3 SEND THE TOKEN BACK TO USER EMAIL
    //req.protocol=http or https ${req.get('host')}= the website address 
    const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`
    const message=
    `
    We have received a password reset request. Please us ethe below link to reset the password\n\n
    ${resetUrl}\n\n. This rest password link will be valid for only 10 mins
    `

    //the reason we are not letting universla error handler not handle this and we are doing try catch is 
    //if emial not sent we want to set passwordresetToken and passwordresetTokenExpires set to undefined
    try{
        await sendEmail({
            email:user.email,
            subject:"Password change request received",
            message:message
        })

        response.status(200).json({
            status:"success",
            message:"Password reset link sent to the user email"
        })
    }catch(err){    //If mail not sent we want to set passwordresetToken and passwordresetTokenExpires set to undefined
        user.passwordresetToken=undefined,
        user.passwordresetTokenExpires=undefined,
        user.save({validateBeforesave:false})

        return next(new CustomError("There was an error sending the password reset email.Please try again later",500))
    }



exports.passwordReset=(req,res,next)=>{}

//We install JSON we Token to send tokens in the repsonse