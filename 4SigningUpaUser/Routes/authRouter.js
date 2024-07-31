const express = require('express');
const authController = require('./../Controllers/authController')

const router = express.Router();

//We use this route whenever we access this /signup route to do a post request
//authController.signup is the route handler function we use 
router.route('/signup').post(authController.signup);

module.exports = router;