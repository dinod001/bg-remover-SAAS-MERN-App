import { Webhook } from "svix"
import userModel from "../models/userModel.js";
import transactionModel from "../models/transactionModel.js";
import Stripe from "stripe";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        })

        const { data, type } = req.body;

        switch (type) {

            case "user.created": {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await userModel.create(userData)
                res.json({})
                break;
            }

            case "user.updated": {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url
                }

                await userModel.findOneAndUpdate({ clerkId: data.id }, userData)
                res.json({})
                break;
            }

            case "user.deleted": {
                await userModel.findOneAndDelete({ clerkId: data.id })
                res.json({})
                break;
            }

            default:
                res.json({})
        }
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//API controller function to get user avaible credits data
const userCredits = async (req, res) => {
    try {

        const userData = await userModel.findOne({ clerkId: req.clerkId })

        res.json({ success: true, credits: userData.creditBalance })

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message })
    }
}

//purchase credit
const purchaseCredits = async (req, res) => {
    try {
        const { planId } = req.body;
        const { origin } = req.headers;
        const { clerkId } = req;
        const userData = await userModel.findOne({ clerkId: req.clerkId })

        if (!userData || !planId) {
            return res.json({ success: false, message: "Data Not Found" });
        }

        let credits, plan, amount, date;

        switch (planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;

            case 'Advanced':
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;

            case 'Business':
                plan = 'Business'
                credits = 5000
                amount = 250
                break;

            default:
                break;
        }

        date=Date.now()

        //creating transaction
        const transactionData = {
            clerkId,
            plan,
            amount,
            credits,
            date
        }

        const newTransaction = await transactionModel.create(transactionData)

        //stripe gateway initialize
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLocaleLowerCase();

        //creating line items to for stripe
        const line_items = [
            {
                price_data: {
                    currency,
                    product_data: {
                        name: newTransaction.plan,
                    },
                    unit_amount: Math.floor(newTransaction.amount) * 100,
                },
                quantity: 1,
            },
        ];
        
       const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: line_items,
        mode: 'payment',
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/cancel`,
        metadata: {
            transactionId: newTransaction._id.toString(),
            clerkId: userData.clerkId,
        },
        payment_intent_data: {            
            metadata: {
            transactionId: newTransaction._id.toString(),
            clerkId: userData.clerkId,
            },
        },
        });
        console.log(session.metadata);
        

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhooks = async (request, response) => {
  console.log("Webhook received");

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    // Use your instantiated stripe object to construct event
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        console.log("Payment succeeded event received");

        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        // List checkout sessions for this payment intent
        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!sessions.data.length) {
          console.error("No checkout sessions found for payment intent:", paymentIntentId);
          break;
        }

        const { transactionId, clerkId } = sessions.data[0].metadata;

        if (!transactionId || !clerkId) {
          console.error("Missing metadata on checkout session");
          break;
        }

        // Update transaction and user
        const purchaseData = await transactionModel.findById(transactionId);
        const userData = await userModel.findById(clerkId);

        if (purchaseData) {
          purchaseData.payment = true;
          await purchaseData.save();
        } else {
          console.error("Transaction not found:", transactionId);
        }

        if (userData) {
          userData.creditBalance = purchaseData?.credits || userData.creditBalance;
          await userData.save();
        } else {
          console.error("User not found:", clerkId);
        }

        break;
      }
      case "payment_intent.payment_failed": {
        console.log("Payment failed event received");

        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const sessions = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!sessions.data.length) {
          console.error("No checkout sessions found for payment intent:", paymentIntentId);
          break;
        }

        const { transactionId } = sessions.data[0].metadata;

        if (!transactionId) {
          console.error("Missing transactionId metadata on checkout session");
          break;
        }

        const purchaseData = await transactionModel.findById(transactionId);

        if (purchaseData) {
          purchaseData.payment = false;
          await purchaseData.save();
        } else {
          console.error("Transaction not found:", transactionId);
        }

        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Acknowledge receipt of the event
    response.status(200).json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    response.status(500).send("Internal Server Error");
  }
};


export { clerkWebhooks, userCredits,purchaseCredits,stripeWebhooks }
