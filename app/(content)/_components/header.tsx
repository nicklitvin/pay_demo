"use client"
import { UserButton } from "@clerk/nextjs"
import { usePathname } from "next/navigation"

export default function Header() {
    const pathname = usePathname();
    let title : string = "";

    switch (pathname) {
        case "/user":
            title = "User Dashboard";
            break;
        case "/admin":
            title = "Admin Dashboard";
            break;
        default:
            title = "Transaction History";
            break;
    }


    return (
        <div className="w-full h-16 relative flex items-center">
            <h1 className="w-full font-bold text-center text-xl">
                {title}
            </h1>
            <div className="absolute right-5">
                <UserButton/>
            </div>
        </div>
    )
}