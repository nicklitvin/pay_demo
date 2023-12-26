import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { makePayment } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.text();
        const signature = headers().get("Stripe-Signature") as string;
    
        let event : Stripe.Event;

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )

        if (event.type == "checkout.session.completed") {
            const session = event.data.object as Stripe.Checkout.Session;
            const metadata = session.metadata;
            await makePayment(metadata!.email, Number(metadata!.amount),false);
        }
        return NextResponse.json(null, {status: 200});

    } catch (err) {
        console.log(err);
        return NextResponse.json("WEBHOOK ERROR", {status: 400});
    }
}