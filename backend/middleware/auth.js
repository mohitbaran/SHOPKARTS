const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModels");

exports.isAuthenticatedUser = catchAsyncErrors( async(req,res,next)=>{

    const {token} = req.cookies;

    if(!token)
        return next(new ErrorHandler("please login to access this",401));
    
    const decodedData = jwt.verify(token, process.env.JWT_KEY);

   req.user= await User.findById(decodedData.id);

   next();
});

exports.authorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} is not allowed to access this resourse`, 403));
        }
        next(); 
    }
}