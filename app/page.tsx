"use client"
import { useRouter } from "next/navigation";

const text = {
    title: "PayControl",
    subtitle: "An easy way to manage user payments",
    email: "Admin Email: quest.throwaway.acc@gmail.com",
    password: "Admin Password: Throwaway!1",
    admin: "Admin Dashboard",
    users: "User Dashboard"
}

export default function Home() {
    const router = useRouter();

    return (
        <div className="w-full h-full flex justify-center bg-back">
            <div className="flex flex-col w-3/5 h-full min-h-full items-center justify-center gap-3">
                <h1 className="font-bold text-6xl text-second text-center">{text.title}</h1>
                <h1 className="text-2xl text-second text-center">{text.subtitle}</h1>
                <h1 className="text-2xl text-second text-center">{text.email}</h1>
                <h1 className="text-2xl text-second text-center">{text.password}</h1>

                <div className="flex flex-row gap-3">
                    <button 
                        onClick={() => router.push("/admin")}
                        className="p-3 rounded-lg bg-first hover:brightness-75 text-back"
                    >
                        {text.admin}
                    </button>
                    <button 
                        onClick={() => router.push("/user")}
                        className="p-3 rounded-lg bg-first hover:brightness-75 text-back"
                    >
                        {text.users}
                    </button>
                </div>
            </div>
        </div>
        
    )
}