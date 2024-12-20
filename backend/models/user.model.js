import mongoose from  "mongoose"

const userSchema =new mongoose.Schema({
    TokenOTP:String,
    TokenOTPExpiresAt:Date
},{timestamps: true});


export const User = mongoose.model('user',userSchema);