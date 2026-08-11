import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import Stripe from 'stripe'


const plans = [
    {
        _id: "basic",
        name: "Basic",
        price: 10,
        credits: 100,
        features: ['100 text generations', '50 image generations', 'Standard support', 'Access to basic models']
    },
    {
        _id: "pro",
        name: "Pro",
        price: 20,
        credits: 500,
        features: ['500 text generations', '200 image generations', 'Priority support', 'Access to pro models', 'Faster response time']
    },
    {
        _id: "premium",
        name: "Premium",
        price: 30,
        credits: 1000,
        features: ['1000 text generations', '500 image generations', '24/7 VIP support', 'Access to premium models', 'Dedicated account manager']
    }
]

//API CONTROLLER FOR GETTING ALL PLANS
export const getPlans = async(req,res) => {
    try {
        res.json({success:true , plans});
    } catch (error) {
        res.json({success:false , message:error.message})
    }
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


//API CONTROLLER TO PURCHASE A PLAN
export const purchasePlan = async(req,res) => {
    try {
        const {planId} = req.body ;
        const userId = req.user._id;
        const plan = plans.find(plan => plan._id === planId)

        if(!plan){
            return res.json({success:false , message : "Invalid Plans"});
        }

        //Create new transaction
        const transaction = await Transaction.create({
            userId : userId ,
            planId : plan._id,
            amount : plan.price ,
            credits : plan.credits ,
            isPaid : false
        })

        const {origin} = req.headers ;
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                price_data: {
                    currency : "usd",
                    unit_amount : plan.price * 100 ,
                    product_data : {
                        name : plan.name
                    }
                },
                quantity: 1,
                },
            ],
            mode: 'payment',
            success_url : `${origin}/loading?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url : `${origin}`,
            metadata : {transactionId : transaction._id.toString() , appId:'astro' },
            payment_intent_data : {
                metadata : {transactionId : transaction._id.toString() , appId:'astro' }
            },
            expires_at : Math.floor(Date.now() / 1000 ) + 30 * 60 , //Expires in 30 minute
            });

        res.json({success : true , url : session.url});    
    } catch (error) {
        res.json({success:false , message : error.message});
    }
}

//API CONTROLLER TO VERIFY STRIPE PAYMENT SESSION
export const verifyPayment = async (req, res) => {
    try {
        const { sessionId } = req.body;
        if (!sessionId) {
            return res.json({ success: false, message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return res.json({ success: false, message: "Session not found" });
        }

        if (session.payment_status === 'paid') {
            const { transactionId, appId } = session.metadata || {};

            if (appId === 'astro' && transactionId) {
                const transaction = await Transaction.findOneAndUpdate(
                    { _id: transactionId, isPaid: false },
                    { $set: { isPaid: true } },
                    { new: true }
                );

                if (transaction) {
                    await User.updateOne(
                        { _id: transaction.userId },
                        { $inc: { credits: transaction.credits } }
                    );

                    return res.json({ success: true, message: "Payment verified and credits updated!" });
                } else {
                    return res.json({ success: true, message: "Payment already processed" });
                }
            }
        }

        res.json({ success: false, message: "Payment not completed" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};