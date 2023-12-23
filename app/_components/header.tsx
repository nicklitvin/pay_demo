"use client"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

export default function Header() {
    const pathname = usePathname();
    let title : string = "";

    switch (pathname) {
        case "/":
            title = "Dashboard";
            break;
        case "/admin":
            title = "Admin Dashboard";
            break;
        default:
            title = "Transaction History";
            break;
    }

    return (
        <div className="h-16 bg-green-500 flex flex-row-reverse p-5 items-center">
            <h1 className="w-full text-center font-bold text-xl">
                {title}
            </h1>
            <div className="absolute right-5">
                <UserButton/>
            </div>
        </div>   
    )
}