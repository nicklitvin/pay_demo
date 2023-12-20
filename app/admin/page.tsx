"use client"
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Admin() {
    const { data, isLoading, error } = useSWR("/api/getAdminData", (url) => axios.get(url).then(res => res.data) );
    let content;

    const [formEmail, setFormEmail] = useState<string>();
    const [formAmount, setFormAmount] = useState<number>();
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);

    useEffect( () => {
        const receivedData : any[] = data;
        try {
            if (receivedData.length > 0) {
                setFormEmail(receivedData[0].email);
            }
            setEmailAddresses(receivedData.map( (val) => val.email));
        } catch (err) {}
    }, [data])

    const makePayment = async () => {
        if (!formEmail) {

        } else if (!formAmount) {

        } else {
            await axios.post("/api/makePayment", {email: formEmail, amount: formAmount});
        }
    }

    if (data) {
        content = <h1>{JSON.stringify(data)}</h1>
    } else if (error) {
        content = <h1>Error with Admin</h1>
    } else {
        content = <h1>Loading...</h1>
    }

    return (
        <>
            <UserButton/>

            <div>
                <select name="Select User" onChange={(e) => setFormEmail(e.target.value)}>
                    {emailAddresses.map( (val) => 
                        <option key={val} value={val}>
                            {val}
                        </option>
                    )}
                </select>
                <input 
                    type="number" 
                    placeholder="Enter Amount" 
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                />
                <button onClick={makePayment}>
                    Make Payment
                </button>
            </div>

            {content}
        </>
    )
}