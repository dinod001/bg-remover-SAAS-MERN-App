import jwt from 'jsonwebtoken'

//Middleware function to decode jwt token to get clerkId'

export const authUser=async(req,res,next)=>{
    try {

        const {token}=req.headers

        if(!token){
            res.json({ success: false, message: "Not Authorized login again" })
        }

        const decoded = jwt.decode(token); // Or jwt.verify(token, PUBLIC_KEY) if verifying
        
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Invalid token." });
        }

        const clerkId = decoded.clerkId || decoded.sub;
        
        req.clerkId = clerkId; // Set on request object
        next()
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
        
    }
}