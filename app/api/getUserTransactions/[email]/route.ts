import { getTransactionHistory, isAdmin } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req : Request) {
    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json(null, {status: 401});

        const user = await currentUser(); 
        const email = user!.emailAddresses[0].emailAddress;

        const userEmail = req.url.split("/getUserTransactions/")[1] + "@gmail.com";

        if (await isAdmin(email) || userEmail === email) {
            const data = await getTransactionHistory(userEmail);
            return NextResponse.json(data, {status: 200});
        } else {
            return NextResponse.json(null, {status: 401});
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json(null, {status: 500})

    }
}