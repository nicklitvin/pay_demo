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
        console.log(data);

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

    // await makePayment("litpineapples@gmail.com",10,true);

    // return NextResponse.json(null, {status: 200});
}