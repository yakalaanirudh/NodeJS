const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt=require('bcryptjs')
const crypto=require('crypto')

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
    role:{                      //We use this role to authorization some special permissions to some type users
        type:String,
        enum:['user','admin'],  //The types of roles we can have
        default:'user'          //Default if not specified
    },
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
    },
    passwordChangedAt:Date,      //This field will not be avilable if user didnt change password
    passwordResetToken:String,
    passwordResetTokenExpires:Date,
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

userSchema.methods.isPasswordChanged=async function(JWTTimeStamp,){
    if(this.passwordChangedAt){
        const passwordChangedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000)

        return JWTTimeStamp<passwordChangedTimeStamp
        //the above true means password was changed after login

    }

    return false
}



userSchema.methods.createResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex')      //creates a hexadecimal token but not encrypted

    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex')        //encryptes the token
    this.passwordResetTokenExpires=Date.now()+10*60*1000                                //expirey time for token

    //we only return token to the user and we store the encrypted token on DB
    //When user returns the next request we comapre that roken to encrypted token on DB
    return resetToken           
    

}

//create a user based on userschema and assign it to User
const User = mongoose.model('User', userSchema);

module.exports = User;