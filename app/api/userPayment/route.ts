import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function GET(req: Request) {
    try {
        const { userId } = auth();

        const user = await currentUser(); 
        const email = user!.emailAddresses[0].emailAddress;

        if (!userId) {
            return NextResponse.json(null, {status: 401});
        }

        const amount = Number(req.url.split("?amount=")[1]);
        
        const transactionFee = Math.ceil((amount + 0.3) / 0.971 * 100) / 100 - amount;
        const roundedFee = Math.round(transactionFee * 100) / 100;

        const lineItems : Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: "Amount Paid"
                    },
                    unit_amount: amount * 100
                }
            },
            {
                quantity: 1,
                price_data: {
                    currency: "USD",
                    product_data: {
                        name: "Transaction Fee"
                    },
                    unit_amount: 100 * roundedFee
                }
            }
        ]

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.STRIPE_RETURN_URL}/user?success=1`,
            cancel_url: `${process.env.STRIPE_RETURN_URL}/user?success=0`,
            customer_email: email,
            metadata: {
                email: email,
                amount: amount
            }
        })

        return NextResponse.json({url: session.url}, {status: 200})

    } catch (err) {
        console.log(err);
        return NextResponse.json(null, {status: 500})
    }
}