"use client"
import { UserButton } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
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
            <div 
                className="absolute left-5 hover:cursor-pointer"
                onClick={() => router.push("/")}
            >
                <h1 className="hover:underline">Home</h1>
            </div>
            <h1 className="w-full font-bold text-center text-xl">
                {title}
            </h1>
            <div className="absolute right-5">
                <UserButton/>
            </div>
        </div>
    )
}