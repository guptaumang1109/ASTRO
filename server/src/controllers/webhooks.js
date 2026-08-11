import Stripe from "stripe";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";

const fulfillTransaction = async (sessionOrObject) => {
    const { transactionId, appId } = sessionOrObject.metadata || {};

    if (appId !== 'astro' || !transactionId) {
        return { success: false, message: "Ignored event: Invalid app or missing transactionId" };
    }

    const transaction = await Transaction.findOneAndUpdate(
        { _id: transactionId, isPaid: false },
        { $set: { isPaid: true } },
        { new: true }
    );

    if (!transaction) {
        return { success: false, message: "Transaction already processed or not found" };
    }

    // Update credit in user account
    await User.updateOne(
        { _id: transaction.userId },
        { $inc: { credits: transaction.credits } }
    );

    return { success: true };
};

export const stripeWebhooks = async(req,res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers["stripe-signature"];

    let event ;

    try {
        event = stripe.webhooks.constructEvent(req.body , sig , process.env.STRIPE_WEBHOOK_SECRET);
    } catch (error) {
        return res.status(400).send(`Webhook Error : ${error.message}`);
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded" : {
                const paymentIntent = event.data.object;
                const { transactionId, appId } = paymentIntent.metadata || {};

                if (transactionId && appId === 'astro') {
                    await fulfillTransaction(paymentIntent);
                } else if (paymentIntent.payment_details?.order_reference) {
                    try {
                        const session = await stripe.checkout.sessions.retrieve(
                            paymentIntent.payment_details.order_reference
                        );
                        if (session) {
                            await fulfillTransaction(session);
                        }
                    } catch (err) {
                        console.error("Error retrieving session from order_reference:", err.message);
                    }
                } else {
                    const sessionList = await stripe.checkout.sessions.list({
                        payment_intent : paymentIntent.id,
                    });
                    if (sessionList.data && sessionList.data.length > 0) {
                        await fulfillTransaction(sessionList.data[0]);
                    }
                }
                break;
            }

            case "checkout.session.completed" : {
                const session = event.data.object;
                await fulfillTransaction(session);
                break;
            }
        
            default:
                console.log("Unhandled event type : " ,event.type);
                break;
        }
        res.json({received:true})
    } catch (error) {
        console.error("Webhook processing error:", error);
        res.status(500).send("Internal Server Error");
    }
}