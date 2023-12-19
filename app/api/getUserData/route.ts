import { createUser, doesEmailExist, getUserInfo } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json(null, {status: 401})

        const clerkUserInfo = await currentUser();
        const userEmail = clerkUserInfo!.emailAddresses[0].emailAddress;

        if (await doesEmailExist(userEmail)) {
            const user = await getUserInfo(userId);
            return NextResponse.json({
                email: userEmail,
                amountDue: user.amountDue
            })
        } else {
            const user = await createUser(userEmail);
            return NextResponse.json({
                email: userEmail,
                amountDue: user.amountDue
            })
        }       
    } catch (err) {
        console.log(err);
        return NextResponse.json(err, {status: 500})
    }
}