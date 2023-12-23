"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Analytics } from "../_components/analytics";

export default function Admin() {
    // const {data, isLoading, error } = {
    //     data: [
    //         {
    //             email: "a@asjdhkjxdkajdhksajdhkasgmail.com",
    //             transactions: []
    //         },
    //         {
    //             email: "b@gmail.com",
    //             transactions: []
    //         },
    //     ],
    //     isLoading: false,
    //     error: false
    // }
    
    const { data, isLoading, error } = useSWR("/api/getAdminData", (url) => axios.get(url).then(res => res.data) );
    let content;

    const [formEmail, setFormEmail] = useState<string>();
    const [formAmount, setFormAmount] = useState<number>();
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);

    useEffect( () => {
        if (!initialLoad) return

        const receivedData : any[] = data;
        try {
            if (receivedData.length > 0) {
                setFormEmail(receivedData[0].email);
            }
            setEmailAddresses(receivedData.map( (val) => val.email));
            setInitialLoad(false);
        } catch (err) {}
    }, [data, initialLoad])

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
        <div className="flex flex-col h-full w-full items-center">
            <div className="flex w-full flex-col gap-2">
                <h1 className="font-bold w-full">Make Custom Payment</h1>
                <div className="flex w-full">
                    <select 
                        className="p-2"
                        name="Select User" 
                        onChange={(e) => setFormEmail(e.target.value)}
                    >
                        {emailAddresses.map( (val) => 
                            <option 
                                key={val} 
                                value={val} 
                                className="p-2"
                            >
                                {val}
                            </option>
                        )}
                    </select>
                </div>
                <div className="flex items-center">
                    <span className="absolute ml-2">
                        $
                    </span>
                    <input
                        type="number" 
                        placeholder="Enter Amount" 
                        onChange={(e) => setFormAmount(Number(e.target.value))}
                        className="p-2 indent-4 w-48"
                    />
                </div>
                
                <button 
                    className="p-3 bg-black font text-white rounded-lg w-48 hover:brightness-50"
                    onClick={makePayment}
                >
                    Make Payment
                </button>
            </div>

            {data ? <Analytics data={data} monthlyFee={100}/> : null}
        </div>
    )
}