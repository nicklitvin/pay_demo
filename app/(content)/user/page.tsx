"use client"

import axios from "axios"
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr"

const text = {
    loading: "Loading...",
    error: "Not a valid user",
    history: "View Transaction History",
    payAll: "Pay The Rest",
    payCustom: "Pay Specified Amount"
}

export default function Home() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [ amount, setAmount ] = useState<number>();
    const { data, isLoading, error } = useSWR("/api/getUserData", (url) => axios.get(url).then(res => res.data) );

    const makePayment = async (amount : number) => {
        const response = await axios.get(`/api/userPayment?amount=${amount}`);
        window.location.assign(response.data.url); 
    }

    const makeCustomPayment = async () => {
        if (!amount || amount < 0) {
            toast.error("Enter a positive amount")
        } else {
            makePayment(amount)
        }
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

    if (isLoading) {
        return <h1 className="font-bold">{text.loading}</h1>
    } else if (error) {
        return <h1 className="font-bold">{text.error}</h1>
    } else {
        return (
            <div className="flex flex-col gap-3 items-center">
                <h1 className="text-lg">{`Amount due: $${data.amountDue}`}</h1>
                <input
                    type="number"
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="p-3 text-center"
                    placeholder="Enter Amount To Pay"
                />
                <button
                        onClick={makeCustomPayment}
                        className="p-3 rounded-lg bg-first text-back hover:brightness-75"
                    >
                        {text.payCustom}
                </button>

                <div className="flex w-full justify-center gap-3">
                    <button 
                        onClick={() => router.push(`/history/${data.email.split("@gmail.com")[0]}`)}
                        className="p-3 rounded-lg bg-first text-back hover:brightness-75"
                    >
                        {text.history}
                    </button>
                    <button
                        onClick={() => makePayment(data.amountDue)}
                        className="p-3 rounded-lg bg-first text-back hover:brightness-75"
                    >
                        {text.payAll}
                    </button>
                </div>
            </div>
        )
    }
}
