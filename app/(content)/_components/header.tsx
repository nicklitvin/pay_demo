"use client"
import { UserButton } from "@clerk/nextjs"
import { usePathname, useRouter } from "next/navigation"

export default function Header() {
    const router = useRouter();
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
        <div className="h-16 bg-primary flex flex-row-reverse p-5 items-center">
            <div 
                className="absolute left-5 hover:cursor-pointer hover:brightness-75 hover:underline" 
                onClick={() =>router.back()}
            >
                <h1 className="font-bold">Back</h1>
            </div>
            <h1 className="w-full text-center font-bold text-xl">
                {title}
            </h1>
            <div className="absolute right-5">
                <UserButton/>
            </div>
        </div>   
    )
}