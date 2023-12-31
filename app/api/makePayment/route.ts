import { isAdmin, makePayment } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req : Request) {
    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json(null, {status: 401});

        const user = await currentUser(); 
        const email = user!.emailAddresses[0].emailAddress;

        const data = await req.json();

        if (await isAdmin(email)) {
            await makePayment(data.email, data.amount, true);
            return NextResponse.json(null, {status: 200});
        } else {
            return NextResponse.json(null, {status: 401});
        }

    } catch (err) {
        console.log(err);
        return NextResponse.json(err, {status: 500});
    }
}