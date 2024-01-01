"use client"

import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect } from "react";
import toast from "react-hot-toast";
import useSWR from "swr"

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data } = useSWR("/api/getUserData", (url) => axios.get(url).then(res => res.data) );

    const makePayment = async (amount : number) => {
        const response = await axios.get(`/api/userPayment?amount=${amount}`);
        window.location.assign(response.data.url); 
    }

    useEffect( () => {
        const success = searchParams.get("success");
        if (success == "1") {
            toast.success("Payment Completed");
        } else if (success == "0") {
            toast.error("Error With Payment");
        }
        window.history.pushState({path: "/user"},"","/user");
    }, [])

    if (data) {
        console.log(data);
        if (data.email && typeof(data.amountDue) === "number") {
            return (
                <div className="flex flex-col gap-3">
                    <h1 className="font-bold text-2xl">{`Signed in as ${data.email}`}</h1>
                    <h1 className="font-bold text-lg">{`Amount due: $${data.amountDue}`}</h1>
                    <button 
                        onClick={() => router.push(`/history/${data.email.split("@gmail.com")[0]}`)}
                        className="p-3 rounded-lg bg-primary font-bold hover:brightness-75 w-60"
                    >
                        View Transaction History
                    </button>
                    <button
                        onClick={() => makePayment(data.amountDue)}
                        className="p-3 rounded-lg bg-primary font-bold hover:brightness-75 w-60"
                    >
                        Pay All
                    </button>
                </div>
            )
        } else {
            return (
                <div>
                    <h1 className="font-bold">User Does Not Exist</h1>
                </div>
            )
        }
    } else {
        return (
            <div>
                <h1 className="font-bold">Loading...</h1>
            </div>
        )
    }
}
