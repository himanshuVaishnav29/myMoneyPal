import { validateToken } from "../services/authentication.js";

export default function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        // console.log("in middleware");
        const tokenCookieValue=req.cookies[cookieName];
        // console.log("cookie",req.cookies[cookieName]);
        if(!tokenCookieValue){
            return next();
            // console.log("No token found in cookies");
            // return res.status(401).json({ error: "Authentication required. No token provided." });
        }
        try{
            const userPayload=validateToken(tokenCookieValue);
            req.user=userPayload;
            // console.log("currUser",req.user);
        }catch(err){
            console.log("Error in authentication middleware",err);
        }
        return next();
    }
}

