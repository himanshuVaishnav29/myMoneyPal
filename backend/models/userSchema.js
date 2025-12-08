import mongoose from "mongoose";
import { randomBytes,createHmac } from "crypto";

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        enum:["Male","Female"],
        required:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    salt:{
        type:String
    },
    resetOTP: {
        type: String
    },
    resetOTPExpiry: {
        type: Date
    },
    signupOTP: {
        type: String
    },
    signupOTPExpiry: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    timezone: {
        type: String,
        default: "UTC"
    },
    lastAIRecommendations: {
        type: Object,
        default: null
    },
    lastAIRecommendationsDate: {
        type: String,
        default: null
    },
    aiRefreshCount: {
        type: Number,
        default: 0
    },
    lastAIRefreshDate: {
        type: String,
        default: null
    }
},{timestamps:true});


userSchema.pre('save',function(next){
    const user=this;
    if(!user.isModified('password')) return;

    // passoword-> salt
    // salt->hashed pass
    // when logging in again user entered pass->salt ,then salt->userEnteredHashedPass,  hashed compared with userHashedPass

    const salt=randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt)
                        .update(user.password)
                        .digest('hex');
    // console.log(hashedPassword);
    this.salt=salt;
    this.password=hashedPassword;
    next();
})

const USER=mongoose.model("users",userSchema);
// module.exports=USER;

export default USER;