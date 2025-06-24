import jwt from 'jsonwebtoken'

//Middleware function to decode jwt token to get clerkId'

export const authUser=async(req,res,next)=>{
    try {

        const {token}=req.headers

        if(!token){
            res.json({ success: false, message: "Not Authorized login again" })
        }

    
        const decoded = jwt.decode(token); // Or jwt.verify(token, PUBLIC_KEY) if verifying

        console.log("decoded",decoded);
        

        if (!decoded) {
        return res.status(401).json({ success: false, message: "Invalid token." });
        }

        const clerkId = decoded.clerkId || decoded.sub;
        console.log("cler id",clerkId);
        
        req.body.clerkId=clerkId
        next()
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
        
    }
}