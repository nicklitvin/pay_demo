"use client"
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();

    return (
        <div className="flex flex-col w-full h-full min-h-full bg-primary items-center justify-center gap-3">
            <h1 className="font-bold text-6xl text-text">Auto-Subscribe</h1>
            <h1 className="text-2xl text-text">Easily Manage Your Subscribers</h1>
            <div className="flex flex-row gap-3">
                <button 
                    onClick={() => router.push("/admin")}
                    className="p-3 rounded-lg bg-complement font-bold hover:brightness-75"
                >
                    Admin Dashboard
                </button>
                <button 
                    onClick={() => router.push("/user")}
                    className="p-3 rounded-lg bg-complement font-bold hover:brightness-75"
                >
                    User Dashboard
                </button>
            </div>
        </div>
    )
}