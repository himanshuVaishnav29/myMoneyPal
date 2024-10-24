import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const secret=process.env.secret;

export function createToken(user){
    const payload={
        _id:user._id,
        email:user.email,
        fullName:user.fullName,
        gender:user.gender,
        profilePicture:user.profilePicture
    }

    const token=jwt.sign(payload,secret,{ expiresIn: '24h' });
    return token;
}

export function validateToken(token){
    const payload=jwt.verify(token,secret);
    return payload;
}

// module.exports={
//     createToken,
//     validateToken
// }