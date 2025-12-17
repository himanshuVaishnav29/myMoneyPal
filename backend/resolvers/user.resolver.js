import USER from '../models/userSchema.js'; 
import {createToken} from '../services/authentication.js';
import {createHmac, randomBytes } from "crypto";
import { sendOTPEmail, sendSignupOTPEmail } from '../services/mailService.js';
import { validateEmail } from '../helpers/index.js';
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
                console.log("Error in getUser",error);
                throw new Error(error,":",error.message);
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
                const{email,password,timezone}=input;
                if (!email || !password){
                    throw new Error("Please fill in all fields");
                } 
                const user=await USER.findOne({email});
                if(!user){
                    throw new Error("User not found");
                }
                if(user.isVerified===false){
                    throw new Error("Please verify your email before logging in");
                }
                
                // Update user's timezone if provided
                if (timezone && timezone !== user.timezone) {
                    await USER.findByIdAndUpdate(user._id, { timezone });
                    user.timezone = timezone;
                }
                
                
                // Check if user has salt (for users created with hashed passwords)
                if (!user.salt) {
                    throw new Error("User account needs to be recreated. Please contact support.");
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
                return { user: userWithoutPassword, token };
            }catch(err){
                console.log("Error in login",err);
                throw new Error(err.message);
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
        requestPasswordReset: async (_, { email, timezone }) => {
            try {
                // Validate email before processing
                const { isValid, error } = await validateEmail(email.toLowerCase().trim());
                if (!isValid) {
                    throw new Error(error);
                }
                
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
                
                await sendOTPEmail(email, otp, timezone);
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
        },
        sendSignupOTP: async (_, { input }) => {
            try {
                const { email, fullName, password, confirmPassword, gender } = input;
                
                // Comprehensive validation before sending OTP
                if (!email || !fullName || !password || !confirmPassword || !gender) {
                    throw new Error("All fields are required");
                }
                
                // Robust email validation (format, disposable check, MX verification)
                const { isValid, error } = await validateEmail(email.toLowerCase().trim());
                if (!isValid) {
                    throw new Error(error);
                }
                
                if (fullName.trim().length < 2) {
                    throw new Error("Full name must be at least 2 characters long");
                }
                
                if (password.length < 5 || password.length > 15) {
                    throw new Error("Password must be between 5 and 15 characters long");
                }
                
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                
                if (!['Male', 'Female'].includes(gender)) {
                    throw new Error("Please select a valid gender");
                }
                
                const existingUser = await USER.findOne({ email });
                if (existingUser && existingUser.isVerified) {
                    throw new Error("User already exists with this email");
                }
                
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                
                if (existingUser && !existingUser.isVerified) {
                    // Update existing unverified user using findByIdAndUpdate to avoid password hashing
                    await USER.findByIdAndUpdate(existingUser._id, {
                        fullName: fullName.trim(),
                        gender,
                        profilePicture: gender === 'Male' 
                            ? `https://avatar.iran.liara.run/public/boy?username=${email}`
                            : `https://avatar.iran.liara.run/public/girl?username=${email}`,
                        signupOTP: otp,
                        signupOTPExpiry: otpExpiry
                    });
                } else {
                    // Create new user
                    await USER.create({
                        email,
                        fullName: fullName.trim(),
                        password: 'temp_password',
                        gender,
                        profilePicture: gender === 'Male' 
                            ? `https://avatar.iran.liara.run/public/boy?username=${email}`
                            : `https://avatar.iran.liara.run/public/girl?username=${email}`,
                        signupOTP: otp,
                        signupOTPExpiry: otpExpiry,
                        isVerified: false
                    });
                }
                
                try {
                    await sendSignupOTPEmail(email, otp);
                    return { message: "OTP sent to your email", success: true };
                } catch (emailError) {
                    // Clean up temp user if email fails
                    await USER.deleteOne({ email, isVerified: false });
                    console.log("Email sending failed:", emailError);
                    throw new Error("Unable to send verification email. Please check your email address and try again.");
                }
            } catch (error) {
                console.log("Error in sendSignupOTP", error);
                throw new Error(error.message);
            }
        },
        verifySignupOTP: async (_, { input }, { req, res }) => {
            try {
                const { email, otp, password } = input;
                
                if (!email || !otp || !password) {
                    throw new Error("Email, OTP, and password are required");
                }
                
                if (otp.length !== 6) {
                    throw new Error("Please enter a valid 6-digit OTP");
                }
                
                const tempUser = await USER.findOne({ 
                    email, 
                    signupOTP: otp,
                    signupOTPExpiry: { $gt: new Date() },
                    isVerified: false
                });
                
                if (!tempUser) {
                    throw new Error("Invalid or expired OTP");
                }
                
                // Update user with actual password and verify
                tempUser.password = password;
                tempUser.signupOTP = undefined;
                tempUser.signupOTPExpiry = undefined;
                tempUser.isVerified = true;
                await tempUser.save();
                
                const { password: _, salt: __, signupOTP: ___, signupOTPExpiry: ____, ...userWithoutPassword } = tempUser.toObject();
                return userWithoutPassword;
            } catch (error) {
                console.log("Error in verifySignupOTP", error);
                throw new Error(error.message);
            }
        },
        resendVerificationOTP: async (_, { email, password }) => {
            try {
                // Validate email format and quality
                const { isValid, error } = await validateEmail(email.toLowerCase().trim());
                if (!isValid) {
                    throw new Error(error);
                }
                
                const user = await USER.findOne({ email, isVerified: false });
                if (!user) {
                    throw new Error("User not found or already verified");
                }
                
                const otp = Math.floor(100000 + Math.random() * 900000).toString();
                const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
                
                const updateData = {
                    signupOTP: otp,
                    signupOTPExpiry: otpExpiry
                };
                
                // If new password provided, update it (will be hashed by middleware)
                if (password && password.length >= 5) {
                    updateData.password = password;
                }
                
                if (password && password.length >= 5) {
                    // Use save() to trigger password hashing for new password
                    user.signupOTP = otp;
                    user.signupOTPExpiry = otpExpiry;
                    user.password = password;
                    await user.save();
                } else {
                    // Use findByIdAndUpdate to avoid password hashing
                    await USER.findByIdAndUpdate(user._id, {
                        signupOTP: otp,
                        signupOTPExpiry: otpExpiry
                    });
                }
                
                try {
                    await sendSignupOTPEmail(email, otp);
                    return { message: "Verification OTP sent to your email", success: true };
                } catch (emailError) {
                    throw new Error("Failed to send verification email. Please try again.");
                }
            } catch (error) {
                console.log("Error in resendVerificationOTP", error);
                throw new Error(error.message);
            }
        },
        verifyEmailOTP: async (_, { input }) => {
            try {
                const { email, otp, password } = input;
                
                if (!email || !otp) {
                    throw new Error("Email and OTP are required");
                }
                
                if (otp.length !== 6) {
                    throw new Error("Please enter a valid 6-digit OTP");
                }
                
                const user = await USER.findOne({ 
                    email, 
                    signupOTP: otp,
                    signupOTPExpiry: { $gt: new Date() },
                    isVerified: false
                });
                
                if (!user) {
                    throw new Error("Invalid or expired OTP");
                }
                
                if (password && password.length >= 5) {
                    // Update password and verify using save() to trigger hashing
                    user.password = password;
                    user.signupOTP = undefined;
                    user.signupOTPExpiry = undefined;
                    user.isVerified = true;
                    await user.save();
                } else {
                    // Just verify without password change
                    await USER.findByIdAndUpdate(user._id, {
                        signupOTP: undefined,
                        signupOTPExpiry: undefined,
                        isVerified: true
                    });
                }
                
                return { message: "Email verified successfully", success: true };
            } catch (error) {
                console.log("Error in verifyEmailOTP", error);
                throw new Error(error.message);
            }
        }
    }
};

export default userResolver; 