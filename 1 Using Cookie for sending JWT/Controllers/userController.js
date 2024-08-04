const User = require('./../Models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');  //To handle the rejected promise
const jwt=require('jsonwebtoken')
const customError=require('./../Utils/CustomError');
const CustomError = require('./../Utils/CustomError');
const util=require('util')
const sendEmail=require('./../Utils/email')
const authController=require('./authController')



exports.getAllUsers=asyncErrorHandler(async(req,res,next)=>{

    //const users=await Users.find({active:true})

    const users=await Users.find()          //We are selecting only active by using pre query

    res.status(200).json({
        status:'success',
        result:users.length,
        data:{
            users
        }
    })
})

//Obj first argument is req body
//...allowedFields are the only keys which a user can modify
const filterReqObj=(obj,...allowedFields)=>{
    const newObj={}                                 //Create a new empty object

    //Object.keys returns an array
    //For all keys in Object(req.body) loop over them if they are in allowed fields
    //if they are set that prop in newObj
    Object.keys(obj).forEach(prop=>{
        if(allowedFields.includes(prop))
            newObj[prop]=obj[prop]
    })

    return newObj
}


exports.updatePassword=asyncErrorHandler(async(req,res,next)=>{

    //STEP 1 GET CURRENT USER DATA FROM DATABASE
    //we get the user object in the req body because earlier we added user as aproperty to the request object
    const user=await User.findById(req.user._id).select('+password')

    //STEP 2 CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
    if(!(await user.comparePasswordInDB(req.body.currentPassword,user.password))){
        return next(new CustomError(`The current password you provided is wrong.`,401))
    }

    //STEP 3 IF SUPPLIED PASSWORD IS CORRECT UPDATE USER PASSWORD WITH NEW VALUE
    user.password=req.body.password
    user.confirmPassword=req.body.confirmPassword
    await user.save()

    //STEP 4 LOGIN USER & SEND JWT

    authController.createSendResponse(user,200,res)

})


exports.updateMe=asyncErrorHandler(async(req,res,next)=>{

    //CHECK IF REQUEST DATA CONTAIN PASSWORD OR CONFIRM PASSWORD
    //Since to update password we have another function
    if(req.body.password ||req.body.confirmPassword){
        return next(new CustomError(`Ypu cannot update password using thsi endpoint.`,400))
    }



    //UPDATE USER DETAIL
    //Before this middleware execute protect middleware executes
    //Inside protect middleware we passed user as an object so we can access it sproperties in this
    
    /*
    const user=await User.findById(req.user._id)
    await user.save()     //Wont woek beacuse it needs value for all required fields
    */


    /*
    This will work but has a bug, the user can set whether he will be user or admin i.e he can set his role himself
    new:true means return the latest document
    const updatedUser=await User.findByIdAndUpdate(req.user._id,req.body,{runValidators:true,new:true})
    */

    const filterObj=filterReqObj(req.body,'name','email')
    //const updatedUser=await User.findByIdAndUpdate(req.user._id,req.body,{runValidators:true,new:true})
    const updatedUser=await User.findByIdAndUpdate(req.user.id,filterObj,{runValidators:true,new:true})
    
    res.status(200).json({
        status:'success',
        data:{
            user:updatedUser
        }
    })


})



exports.deleteMe=asyncErrorHandler(async(req,res,next)=>{
    //We are soft deleting it wont be deleted but it wont be shown when querying active users
    //We do this if user wants to reactivate after deleting we can just set active to true
    await User.findByIdAndUpdate(req.user._id,{active:false})   

    res.status(204).json({
        status:'success',
        data:null
    })
})
