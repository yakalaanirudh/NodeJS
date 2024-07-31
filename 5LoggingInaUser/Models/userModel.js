const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs')

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
        minlength: 8,
        select:false        //When user data sent in response password wont be sent
    },
    confirmPassword: {
        type: String,
        required: [true, 'Please confirm your password.'],
        //This is a custom validator
        //This will only work for save and create methods, it wont work on find and update
        //To check if it matches entry in password
        validate:{
            validator: function(val){
                return val===this.password
        }
    }
}
})

//This is executed before saving a user

userSchema.pre('save',async function(next){
    //If a user modified his password this wont run
    if(!this.isModified('password')) return next()

    //But of user modified his password
    //encrypt password before saving it
    //for this we install a bcrypts js middleware to has the password
    //12 is cost
    //bcrypt first salts the password means it will add some random string to it so that two passwords wont generate same hash
    //higher the cost more intensive and better encryption
    this.password=await bcrypt.hash(this.password,12)

    //We do this because we use confiem password to make sure user entired password correctly second time
    //We dont want to save this in the database
    // so we set it to null
    //But we set confirmpassword as rwquired field in the schema
    //But we set it to undefined here
    //It is because required checks if there is only a value, it wont check what it is
    confirmPassword=undefined

    next()

})

//Check if password given by user is same as password in db 
//The password in db should be decrypted to compare so we use bcrypt
//This is an instant method so we need to use .methods when definig it
userSchema.methods.comparePasswordInDB=async function(pswd,pswdDB){
    return await bcrypt.compare(pswd,pswdDB)
}

//create a user based on userschema and assign it to User
const User = mongoose.model('User', userSchema);

module.exports = User;