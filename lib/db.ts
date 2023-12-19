import { PrismaClient } from "@prisma/client";

// PRISMA SETUP

declare global {
    var prisma: undefined | PrismaClient
}

function makePrisma() {
    console.log("making prisma client");
    return new PrismaClient();
}

const prisma = globalThis.prisma ?? makePrisma();
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// MAIN DB FUNCTIONS

let monthlyFee : number | null;
interface UserInfo {
    amountDue: number
}

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

async function doesEmailExist(email : string) : Promise<boolean> {
    const count = await prisma.users.count({
        where: {
            email: email
        }
    });
    return count > 0;
}

async function getUserInfo(email : string) : Promise<UserInfo> {
    const amountDue = await getAmountDue(email);

    return {
        amountDue: amountDue
    };
}

async function getAmountDue(email : string) {
    const pastTransactions = await prisma.transactions.aggregate({
        _sum: {
            amount: true
        },
        where: {
            AND: [
                {email: email},
                {date: {gte: new Date(), lte: new Date()}}
            ]
        }
    });
    const pastSum = pastTransactions._sum.amount;
    const totalPaid = pastSum ?? 0;

    const monthlyFee = await getMonthlyFee();
    return monthlyFee - totalPaid;
}

async function createUser(email : string) : Promise<UserInfo> {
    await prisma.users.create({
        data: {
            email: email,
        }
    });
    return {
        amountDue: await getMonthlyFee()
    };
}

async function isAdmin(email : string) : Promise<boolean> {
    const data = await prisma.globals.findFirst({
        where: {
            type: "adminEmail",
        }
    });

    return data?.value == email;
}

async function getAdminData() {
    const data = await prisma.users.findMany({
        select: {
            email: true,
            transactions: {
                select: {
                    amount: true,
                    date: true
                },
                where: {
                    date: {
                        gte: new Date()
                    }
                }
            }
        }
    });
    return data
}

export {
    doesEmailExist,
    getUserInfo,
    createUser,
    isAdmin,
    getAdminData,
}



