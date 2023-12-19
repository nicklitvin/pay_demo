import { getAdminData, isAdmin } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { userId } = auth();
        if (!userId) return NextResponse.json(null, {status: 401});

        const user = await currentUser(); 
        const email = user!.emailAddresses[0].emailAddress;

        if (await isAdmin(email)) {
            const data = await getAdminData();
            return NextResponse.json(data, {status: 200});
        } else {
            return NextResponse.json(null, {status: 401});
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json(err, {status: 500});
    }
}