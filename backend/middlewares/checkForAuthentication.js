
export default function checkForAuthenticationCookie(cookieName){
    return(req,res,next)=>{
        const tokenCookieValue=req.cookies[cookieName];
        // console.log(req.cookies[cookieName]);
        if(!tokenCookieValue){
            return next();
        }
        try{
            const userPayload=validateToken(tokenCookieValue);
            req.user=userPayload;
        }catch(err){
            console.log("Error in authentication middleware",err);
        }
        return next();
    }
}

