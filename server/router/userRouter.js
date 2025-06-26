import express from 'express'
import { clerkWebhooks, purchaseCredits, userCredits } from '../controllers/userController.js'
import { authUser } from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post("/webhooks", clerkWebhooks)
userRouter.get('/credits', authUser, userCredits)
userRouter.post('/payment', authUser, purchaseCredits)
export default userRouter