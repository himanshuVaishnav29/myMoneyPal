import { users } from "../testData/testData.js";
import USER from '../models/userSchema.js'; 
import {createToken} from '../services/authentication.js';
import {createHmac } from "crypto";


const userResolver={
    Query:{
        users:()=>{
            return users
        },
        user:(_,{userId})=>{
            return users.find((user)=>user._id===userId);
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
                const maleProfilePic=`https://avatar.iran.liara.run/public/boy?email=${email}`;
                const femaleProfilePic=`https://avatar.iran.liara.run/public/girl?email=${email}`;
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
                const user=await USER.findOne({email});
                if(!user){
                    throw new Error("User Not found");
                }
                const salt=user.salt;
                const hashedPassword=user.password;
                const userProvidedHash=createHmac('sha256',salt)
                                    .update(password)
                                    .digest('hex');
                if(hashedPassword!=userProvidedHash){
                    throw new Error("Invalid password");
                }
                const token=createToken(user);
                // console.log(token);
                const cookieOptions={
                    httpOnly:true
                };
                // console.log(token);
                // console.log(user);
                res.cookie('token',token,cookieOptions);
                // console.log(res);
                // console.log(req.cookies['token']);

                return user;
            }catch(err){
                console.log("Error in login",err);
                throw new Error(err,":",err.message);
            }
        },
        logout:async(parent, args, { req, res })=>{
            try {
                res.clearCookie('token');
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