const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: [true, "Enter the name"],
        maxlength:[40,"Name cannot exceed 40 char"],
        minlength:[4,"Name should have more than 4 char"]
    },
    email:{
        type: String,
        required: [true, "Enter the Email"],
        unique: true,
        validate:[validator.isEmail, "Enter a valid Email"],
    },
    password:{
        type: String,
        required: [true, "Enter the Password"],
        minlength:[8, "Password should be greater than 8 char"],
        select: false,
    },
    avatar:{
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        }
    },
    role:{
        type: String,
        default: "user",
    },
    createdAt:{
        type: Date,
        default:Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function(next){

    /* humlog saare fields ko edit karne ko option denge but password ko nhi,
    agar password change hoga tab hi humlog hash karenge warna
    yeh hash password ko bhi hash kar dega */

    if(!this.isModified("password")){
        next();
    }

    this.password = await bcrypt.hash(this.password,10);
});

// JWT Token
userSchema.methods.getJWTToken = function (){
    return jwt.sign({id: this._id}, process.env.JWT_KEY,{
        expiresIn: process.env.JWT_EXPIRE,
    });
}

// Compare Password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

// Reset Password
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken= crypto.createHash("sha256").update(resetToken).toString("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);