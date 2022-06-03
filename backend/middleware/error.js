const ErrorHandler= require('../utils/errorHandler');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;

    err.message = err.message || 'INTERNAL SERVER ERROR';


    //Wrong Mongodb ID
    if(err.name=== "CastError"){
        const message= `Resourse Not Found. INVALID: ${err.path}`;
        err=new ErrorHandler(message,400);
    }

    // Duplicate Key Error(Mongoose):: agar same field se koi registered ho tab
    if(err.code === 11000 ){
        const message = `Already registered ${Object.keys(err.keyValue)}. Kindly Login Please`;
        err= new ErrorHandler(message,400);
    }

    // JWT token error
    if (err.code === "JsonWebTokenError") {
        const message = `Json Web Token Error. Kindly please try it again`;
        err = new ErrorHandler(message, 400);
    }

    // JWT token EXPIRED
    if (err.code === "TokenExpiredError") {
        const message = `Json Web Token Expired. Kindly please try it again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}