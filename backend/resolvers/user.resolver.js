import { users } from "../testData/testData.js";
import USER from '../models/userSchema.js'; 
import {createToken} from '../services/authentication.js';
import {createHmac } from "crypto";


const userResolver={
    Query:{
        authUser:async(_,__,{req,res,user})=>{
            try{
                // console.log("now",req.user);
                // user=req.user;
                console.log(user);
                return user;
            }catch(err){
                console.log("Error in authUser",err);
            }
        },
        getUser:async(_,{userId})=>{
            try {
                const user=await USER.findById(userId);
                return user;
            } catch (error) {
                console.log("Error in getUser",err);
                throw new Error(err,":",err.message);
            }
        }
        
    },
    Mutation:{
        signUp:async(_,{input},{ req, res })=>{
            try{
                const {email,fullName,password,gender}=input;
                if(!email || ! fullName || !password || !gender){
                    throw new Error("All fields are required");
                }
                const existingUser=await USER.findOne({email});
                if(existingUser){
                    throw new Error("User already exists with this email");
                }
                const maleProfilePic=`https://avatar.iran.liara.run/public/boy?username=${email}`;
                const femaleProfilePic=`https://avatar.iran.liara.run/public/girl?username=${email}`;
                const newUser=await USER.create({
                    fullName:fullName,
                    email:email,
                    password:password,
                    gender:gender,
                    profilePicture:gender=='Male'?maleProfilePic:femaleProfilePic
                })
                return newUser;
            }catch(err){
                console.log("Error in signUp",err);
                throw new Error(err,":",err.message);
            }
        },
        login:async(_,{input},{ req, res })=>{
            try{
                const{email,password}=input;
                if (!email || !password){
                    return new Error("Please fill in all fields");
                } 
                const user=await USER.findOne({email});
                if(!user){
                    throw new Error("User Not found );");
                }
                const salt=user.salt;
                const hashedPassword=user.password;
                const userProvidedHash=createHmac('sha256',salt)
                                    .update(password)
                                    .digest('hex');
                if(hashedPassword!=userProvidedHash){
                    throw new Error("Invalid password");
                }
                // console.log('login: ',user);
                const token=createToken(user);
                // console.log(token);

                const cookieOptions={
                    httpOnly:true,
                    sameSite: "None", 
                    secure: true,     
                };

                // console.log(token);
                // console.log(user);
                res.cookie('token',token,cookieOptions);
                // console.log(res);
                // console.log('Response Headers: ', res.getHeaders());
                // console.log("cookieNow",req.cookies['token']);

                return user;
            }catch(err){
                console.log("Error in login",err);
                throw new Error(err,":",err.message);
            }
        },
        logout:async(parent, args, { req, res })=>{
            try {
                const cookieOptions={
                    httpOnly:true,
                    sameSite: "None", 
                    secure: true,     
                };
                res.clearCookie('token',cookieOptions);
                // delete req.cookies['token'];
                // console.log("token",req.cookies['token']);
                return {message:"Logged out Successfully"};
            } catch (error) {
                console.log("Error in logout",error);
                throw new Error(err.message);
            }
        }
    }
};

export default userResolver; 