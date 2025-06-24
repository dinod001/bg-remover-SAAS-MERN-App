import jwt from 'jsonwebtoken'

//Middleware function to decode jwt token to get clerkId'

export const authUser=async(req,res,next)=>{
    try {

        const {token}=req.headers

        if(!token){
            res.json({ success: false, message: "Not Authorized login again" })
        }

        
        const token_decode=jwt.decode(token)
        req.body.clerkId=token_decode.clerkId
        console.log(token_decode.clerkId);
        
        next()
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
        
    }
}