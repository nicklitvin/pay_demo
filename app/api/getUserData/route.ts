import { createUser, doesUserExist, getUserInfo } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();
        
        if (!userId) return NextResponse.json(null, {status: 401})

        if (await doesUserExist(userId)) {
            const user = await getUserInfo(userId);
            return NextResponse.json({
                email: user.email,
                amountDue: user.amountDue
            })
        } else {
            const clerkUserInfo = await currentUser();
            const userEmail = clerkUserInfo!.emailAddresses[0].emailAddress;
            const user = await createUser(userId, userEmail);
            return NextResponse.json({
                email: user.email,
                amountDue: user.amountDue
            })
        }       
    } catch (err) {
        console.log(err);
        return NextResponse.json(err, {status: 500})
    }
}