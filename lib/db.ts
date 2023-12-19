import { PrismaClient } from "@prisma/client";

interface UserInfo {
    email : String,
    amountDue: Number
}

const prisma = new PrismaClient();
let monthlyFee : number | null;

async function getMonthlyFee() : Promise<number> {
    if (!monthlyFee) {
        const data = await prisma.globals.findFirst({
            where: {
                type: "monthlyFee"
            }
        });
        monthlyFee = Number(data!.value);
    }
    return monthlyFee;
}

async function doesUserExist(userId : string) : Promise<boolean> {
    const count = await prisma.users.count({
        where: {
            userId: userId
        }
    });
    return count > 0;
}

async function getUserInfo(userId : string) : Promise<UserInfo> {
    const user = await prisma.users.findFirst({
        where: {
            userId: userId
        }
    });
    const amountDue = await getAmountDue(userId);

    return {
        email: user!.email,
        amountDue: amountDue
    };
}

async function getAmountDue(userId : string) {
    const pastTransactions = await prisma.transactions.aggregate({
        _sum: {
            amount: true
        },
        where: {
            AND: [
                {userId: userId},
                {date: {gte: new Date(), lte: new Date()}}
            ]
        }
    });
    const pastSum = pastTransactions._sum.amount;
    const totalPaid = pastSum ?? 0;

    const monthlyFee = await getMonthlyFee();
    return monthlyFee - totalPaid;
}

async function createUser(userId : string, email : string) : Promise<UserInfo> {
    const user = await prisma.users.create({
        data: {
            email: email,
            userId: userId
        }
    });
    return {
        email: user!.email,
        amountDue: await getMonthlyFee()
    };
}

export {
    doesUserExist,
    getUserInfo,
    createUser
}



