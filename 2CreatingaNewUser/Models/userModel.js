const mongoose = require('mongoose');
const validator = require('validator');

//name, email, password, confirmPassword, photo
//Schema on rhs is aconstructor for the schema class
//we use it to create a new schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter an email.'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email.']//validate if the entry is in email format like @something.com
    },
    //This photo field has a path to where the photos are saved in the local directory
    photo: String,              //Photo not compulsory type lets say string
    password: {
        type: String,
        required: [true, 'Please enter a password.'],
        minlength: 8
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.']
    }
})

//create a user based on userschema and assign it to User
const User = mongoose.model('User', userSchema);

module.exports = User;