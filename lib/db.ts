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
    const pastTransactions = await prisma.transactions.findMany({
        where: {
            AND: [
                {email: email},
                {date: {gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)}}
            ]
        }
    });
    const totalPaid = pastTransactions.reduce( (previous,current) => previous + current.amount, 0);
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
        include: {
            transactions: {
                select: {
                    date: true,
                    amount: true,
                    admin: true
                }
            }
        }
    })
    return data;
}

async function makePayment(email : string, amount : number, admin : boolean) {
    await prisma.transactions.create({
        data: {
            admin: admin,
            amount: amount,
            date: new Date(),
            email: email,
        }
    })
    await prisma.users.update({
        where: {
            email: email
        },
        data: {
            transactions: {
                connect: {
                    email: email
                }
            }
        }
    })
}

export {
    doesEmailExist,
    getUserInfo,
    createUser,
    isAdmin,
    getAdminData,
    makePayment
}



