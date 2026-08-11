import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
    name : {type : String ,
        required : true , trim : true
    } ,
    email : {
        type : String ,
        required : [true, "Email is required"] ,
        unique : true ,
        trim : true ,
        lowercase : true ,
        match : [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email address"]
    },
    password : {type : String ,
        required :[true , "Password is required"],
    },
    credits : {type : Number ,
        default : 20
    },
    isEmailVerified : {
        type : Boolean ,
        default : false
    },
    refreshToken : {
        type : String
    },
    forgotPasswordToken : {
        type : String
    },
    forgotPasswordExpiry : {
        type : Date
    },
    emailVerificationToken : {
        type : String ,
    },
    emailVerificationExpiry : {
        type : Date
    }
} , {timestamps : true} );

//HASH PASSWORD BEFORE SAVING
userSchema.pre('save' , async function (){
    if(!this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password , 10);
})

//CHECKING THE PASSWORD ENTERED IS CORRECT OR NOT
userSchema.methods.isPasswordCorrect = async function 
(password) {
    return await bcrypt.compare(password , this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id : this._id ,
            email : this.email ,
            username : this.username
        } ,
        process.env.ACCESS_TOKEN_SECRET ,
        {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id : this._id
        } ,
        process.env.REFRESH_TOKEN_SECRET ,
        {expiresIn : process.env.REFRESH_TOKEN_EXPIRY}
    )
}

userSchema.methods.generateTemporaryToken = function () {
    const unHashedToken = crypto.randomBytes(20).toString("hex")

    const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex")

    const tokenExpiry = Date.now() + (20*60*1000) //20 mins
    return {unHashedToken , hashedToken , tokenExpiry}
}

const User = mongoose.model('User' , userSchema);

export default User ;