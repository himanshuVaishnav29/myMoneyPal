import { validateToken } from "../services/authentication.js";

export default function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        // console.log("in middleware");
        // Try cookie first
        const tokenCookieValue = req.cookies[cookieName];
        if (tokenCookieValue) {
            try{
                const userPayload = validateToken(tokenCookieValue);
                req.user = userPayload;
            } catch(err){
                console.log("Error validating cookie token", err);
            }
            return next();
        }

        // Fallback: Check Authorization header (Bearer <token>)
        const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.headers['x-access-token'];
        if (authHeader) {
            const parts = authHeader.split(' ');
            const token = parts.length === 2 && parts[0].toLowerCase() === 'bearer' ? parts[1] : authHeader;
            if (token) {
                try{
                    const userPayload = validateToken(token);
                    req.user = userPayload;
                } catch(err){
                    console.log("Error validating auth header token", err);
                }
            }
        }

        return next();
    }
}

