import USER from '../models/userSchema.js'; 
import {createToken} from '../services/authentication.js';
import {createHmac, randomBytes } from "crypto";
import { sendOTPEmail } from '../services/mailService.js';
import cloudinary from '../services/cloudinaryService.js';
import { cache } from '../services/redisService.js';


const userResolver={
    Query:{
        authUser:async(_,__,{req,res,user})=>{
            try{
                if (!user) return null;
                
                const cacheKey = `user:${user._id}`;
                
                // Try to get from cache first
                let cachedUser = await cache.get(cacheKey);
                if (cachedUser) {
                    return cachedUser;
                }
                
                // Fetch fresh user data from database
                const freshUser = await USER.findById(user._id);
                if (!freshUser) return null;
                
                const { password: _, salt: __, ...userWithoutPassword } = freshUser.toObject();
                
                // Cache user data for 5 minutes
                await cache.set(cacheKey, userWithoutPassword, 300);
                
                return userWithoutPassword;
            }catch(err){
                console.log("Error in authUser",err);
                return null;
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
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new Error("Please enter a valid email.");
                }
                if (password.length < 5) {
                    throw new Error("Password must be at least 5 characters long.");
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
                    sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", 
                    secure: process.env.NODE_ENV === 'production',  
                    maxAge: 24 * 60 * 60 * 1000, //one day
                    path: '/'
                };

                // console.log(token);
                // console.log(user);
                res.cookie('token',token,cookieOptions);
                // console.log(res);
                // console.log('Response Headers: ', res.getHeaders());
                // console.log("cookieNow",req.cookies['token']);

                const { password: _, salt: __, ...userWithoutPassword } = user.toObject();
                return userWithoutPassword;
            }catch(err){
                console.log("Error in login",err);
                throw new Error(err,":",err.message);
            }
        },
        logout:async(parent, args, { req, res })=>{
            try {
                const cookieOptions={
                    httpOnly:true,
                    sameSite: process.env.NODE_ENV === 'production' ? "None" : "Lax", 
                    secure: process.env.NODE_ENV === 'production',
                    path: '/'
                };
                res.clearCookie('token',cookieOptions);
                return {message:"Logged out Successfully"};
            } catch (error) {
                console.log("Error in logout",error);
                throw new Error(err.message);
            }
        },
        updateProfile: async (_, { input }, { user }) => {
            try {
                if (!user) {
                    throw new Error("Authentication required");
                }
                const updatedUser = await USER.findByIdAndUpdate(
                    user._id,
                    { $set: input },
                    { new: true }
                );
                
                // Invalidate user cache
                await cache.del(`user:${user._id}`);
                
                const { password: _, salt: __, ...userWithoutPassword } = updatedUser.toObject();
                return userWithoutPassword;
            } catch (error) {
                console.log("Error in updateProfile", error);
                throw new Error(error.message);
            }
        },
        uploadProfileImage: async (_, { file }, { user }) => {
            try {
                if (!user) {
                    throw new Error("Authentication required");
                }
                
                const fileData = await file;
                console.log('File data:', fileData);
                
                // Access the actual file object from the Upload promise
                const actualFile = fileData.file || fileData;
                
                if (!actualFile || typeof actualFile.createReadStream !== 'function') {
                    throw new Error('Invalid file upload');
                }
                
                const { createReadStream, filename, mimetype } = actualFile;
                
                if (mimetype && !mimetype.startsWith('image/')) {
                    throw new Error('Please upload a valid image file');
                }
                
                const stream = createReadStream();
                
                // Upload directly to Cloudinary using stream
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'profile_pictures',
                            public_id: `user_${user._id}_${Date.now()}`,
                            transformation: [
                                { width: 400, height: 400, crop: 'fill' },
                                { quality: 'auto' }
                            ]
                        },
                        (error, result) => {
                            if (error) {
                                console.log('Cloudinary error:', error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                    
                    stream.pipe(uploadStream);
                    
                    stream.on('error', (error) => {
                        console.log('Stream error:', error);
                        reject(error);
                    });
                });
                
                await USER.findByIdAndUpdate(user._id, {
                    profilePicture: uploadResult.secure_url
                });
                
                // Invalidate user cache
                await cache.del(`user:${user._id}`);
                
                return {
                    url: uploadResult.secure_url,
                    message: "Profile image uploaded successfully"
                };
            } catch (error) {
                console.log("Error in uploadProfileImage", error);
                throw new Error(error.message);
            }
        },
        requestPasswordReset: async (_, { email }) => {
            try {
                const user = await USER.findOne({ email });
                if (!user) {
                    throw new Error("User not found");
                }
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                
                await USER.findByIdAndUpdate(user._id, {
                    resetOTP: otp,
                    resetOTPExpiry: otpExpiry
                });
                
                await sendOTPEmail(email, otp);
                return { message: "OTP sent to your email", success: true };
            } catch (error) {
                console.log("Error in requestPasswordReset", error);
                throw new Error(error.message);
            }
        },
        verifyOTPAndResetPassword: async (_, { input }) => {
            try {
                const { email, otp, newPassword } = input;
                const user = await USER.findOne({ 
                    email, 
                    resetOTP: otp,
                    resetOTPExpiry: { $gt: new Date() }
                });
                
                if (!user) {
                    throw new Error("Invalid or expired OTP");
                }
                
                user.password = newPassword;
                user.resetOTP = undefined;
                user.resetOTPExpiry = undefined;
                await user.save();
                
                const { password: _, salt: __, ...userWithoutPassword } = user.toObject();
                return userWithoutPassword;
            } catch (error) {
                console.log("Error in verifyOTPAndResetPassword", error);
                throw new Error(error.message);
            }
        }
    }
};

export default userResolver; 