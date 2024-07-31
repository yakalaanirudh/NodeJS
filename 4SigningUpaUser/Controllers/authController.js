const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');  //To handle the rejected promise
const jwt=require('jsonwebtoken')

//It returns a promise
exports.signup = asyncErrorHandler(async (req, res, next) => {
    //create a new user with the user Schema and applying create method on it
    const newUser = await User.create(req.body);

    //This is teh token
    //It takes two arguments the first is the payload
    //The second is the secret key
    //We can add additional argumentsblike whn the token expires after duration
    const token=jwt.sign({id:newUser.id},process.env.SECRET_STR,{
        expiresIn:process.env.LOGIN_EXP
    })

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


//We install JSON we Token to send tokens in the repsonse