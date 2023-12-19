import { makePayment } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    await makePayment("litpineapples@gmail.com",10,true);

    return NextResponse.json(null, {status: 200});
}