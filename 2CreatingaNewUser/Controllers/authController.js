const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');  //To handle the rejected promise

//It returns a promise
exports.signup = asyncErrorHandler(async (req, res, next) => {
    //create a new user with the user Schema and applying create method on it
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});