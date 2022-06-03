const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User=require("../models/UserModels");
const sendToken = require("../utils/JWT");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");
const cloudinary = require('cloudinary');
// Register a User

exports.registerUser = catchAsyncErrors(async(req,res,next)=>{
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: 'avatars',
        width: 150,
        crop:'scale',
    });

    const {name, email, password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url, 
        }
    });

   sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncErrors( async(req,res,next)=>{
    const {email, password}= req.body;

    // checking if both entered or not
    
    if(!email || !password){
        return next(new ErrorHandler("Please Enter email & password", 400));
    }

    const user = await User.findOne({email}).select("+password");
    const isPasswordMatched = await user.comparePassword(password);

    if(!user || !isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user, 200, res);
})

// Logout USer

exports.logout = catchAsyncErrors(async(req,res,next)=>{
   
   res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true, 
   });
   
    res.status(200).json({
        success:true,
        message:"logged out",
    })
});

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler(`${user} is not registered`,404));
    }

    // Get Reset Password Token

    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl= `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

    const message = `To Reset the password click on this link :- \n\n ${resetPasswordUrl} \n\nIgnore if you have not requested for the same.`

    try{
        await sendEmail({
            email: user.email,
            subject: `Apni Dukaan Password Recovery`,
            message,
        });
        
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    } catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(err.message, 500));
    }
});

exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).toString("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()},
    });

    if(!user)
        return next(new ErrorHandler("Reset Token is invalid or has expired",400));

    if(req.body.password !== req.body.confirmPassword)
        return next(new ErrorHandler("Password does not match", 400));

    user.password= req.body.password;

    user.resetPasswordToken= undefined;
    user.resetPasswordExpire= undefined;

    await user.save();

    sendToken(user, 200, res);
});

// Get User Details
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});

// Update User Password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched)
        return next(new ErrorHandler("Old Password is not correct", 401));

    if(req.body.newPassword !== req.body.confirmPassword)
        return next(new ErrorHandler("Please Enter the Same Password",401));

    user.password= req.body.confirmPassword;

    await user.save();

    sendToken(user, 200, res);
});

// Update USer Profile
exports.updateProfile = catchAsyncErrors(async(req, res, next)=>{

    const newData={
        name:req.body.name,
        email:req.body.email,
    }

    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    })
});

// Get All uSer (admin)
exports.getAllUser = catchAsyncErrors(async(req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
});
 
// Get details of single user(admin)
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if(!user)
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`,400))
    res.status(200).json({
        success: true,
        user,
    });
});

// Update USer Role --ADMIN
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email,
        role:req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });



    res.status(200).json({
        success: true,
    })
});

// Delete USer ---ADMIN
exports.deleteUserProfile = catchAsyncErrors(async (req, res, next) => {


    const user = await User.findByIdAndUpdate(req.params.id,);

    if(!user)
        return next(new ErrorHandler(`User Does Not Exist with ID: ${req.params.id}`));

    await user.remove();

    res.status(200).json({
        success: true,
        message:'User deleted Successfully'
    })
});


