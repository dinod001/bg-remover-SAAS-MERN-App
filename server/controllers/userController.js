import { Webhook } from "svix"
import userModel from "../models/userModel.js";

const clerkWebhooks=async(req,res)=>{
    try {
        //create s svix instance with clerk webhook secret
        const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)
        
        //verfiy the webhook header
        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"],
        })

        const {data,type}=req.body;

        switch(type){

            case"user.created":{

                const userData={
                    clerkId:data._id,
                    email:data.email_addresses[0].email_adress,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    photo:data.image_url
                }

                await userModel.create(userData)
                res.json({})
                break;
            }

            case"user.updated":{

                const userData={
                    email:data.email_addresses[0].email_adress,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    photo:data.image_url
                }
                await userModel.findByIdAndUpdate({clerkId:data._id},userData)
                res.json({})
                break;
            }

            case"user.deleted":{
                await userModel.findByIdAndDelete({clerkId:data._id})
                res.json({})
                break;
            }
        }
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message})
    }
}

export {clerkWebhooks}