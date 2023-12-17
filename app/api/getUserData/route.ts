import { MONTHLY_FEE } from "@/app/globals";
import { auth, currentUser } from "@clerk/nextjs";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!user || !userId) {
            return NextResponse.json(null, {status: 401})
        }

        let foundUser = await prisma.users.findFirst({
            where: {userId: userId}
        })

        if (!foundUser) {
            foundUser = await prisma.users.create({
                data: {
                    email: user.emailAddresses[0].emailAddress,
                    amount_due: MONTHLY_FEE,
                    userId: userId
                }
            })
        }

        return NextResponse.json({
            email: foundUser.email,
            amountDue: foundUser.amount_due
        })
    } catch (err) {
        console.log(err);
        return NextResponse.json(err, {status: 500})
    }
}