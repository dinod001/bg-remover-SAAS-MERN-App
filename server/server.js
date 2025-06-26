import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/mongoose.js'
import userRouter from './router/userRouter.js'
import imageRouter from './router/imageRouter.js'
import { stripeWebhooks } from './controllers/userController.js'


//App config
const PORT=process.env.PORT||4000
const app=express()
await connectDB()

//Initialize middleware
app.use(express.json())
app.use(cors())

//API routes
app.get("/",(req,res)=>{
    res.send("API is working") 
})

app.use("/api/user",userRouter)
app.use('/api/image',imageRouter)
app.post("/stripe", express.raw({ type: "application/json" }), stripeWebhooks);

app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`);
    
})
