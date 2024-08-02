const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();

//We use this route whenever we access this /signup route to do a post request
//authController.signup is the route handler function we use 
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/forgotPassword').post(authController.forgotPassword);

//In the URL we are including the Token as a route paramter
router.route('/resetPassword/:token').patch(authController.resetPassword); //Patch because we only update password


//router.route('/updatePassword').patch(authController.protect , authController.updatePassword); //Patch because we only update password

module.exports = router;