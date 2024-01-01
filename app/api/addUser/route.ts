import { createUser, isAdmin } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req : Request) {
    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json(null, {status: 401});

        const user = await currentUser(); 
        const email = user!.emailAddresses[0].emailAddress;

        if (await isAdmin(email)) {
            const data = await req.json();
            await createUser(data.email);
            return NextResponse.json(null, {status: 200});
        } else {
            return NextResponse.json(null, {status: 401});
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json(null, {status: 500})
    }
}