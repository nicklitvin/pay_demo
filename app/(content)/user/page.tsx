"use client"

import axios from "axios"
import { useRouter } from "next/navigation";
import useSWR from "swr"

export default function Home() {
    const router = useRouter();
    const { data } = useSWR("/api/getUserData", (url) => axios.get(url).then(res => res.data) );

    if (data) {
        return (
            <div>
                <h1 className="font-bold text-2xl">{`Signed in as ${data.email}`}</h1>
                <h1 className="font-bold text-lg">{`Amount due: $${data.amountDue}`}</h1>
                <button 
                    onClick={() => router.push(`/history/${data.email.split("@gmail.com")[0]}`)}
                    className="p-3 rounded-lg bg-primary font-bold hover:brightness-75"
                >
                    View Transaction History
                </button>
            </div>
        )
    } else {
        return (
            <div>
                <h1 className="font-bold">Loading...</h1>
            </div>
        )
    }
}
