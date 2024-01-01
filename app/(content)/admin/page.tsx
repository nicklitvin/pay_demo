"use client"
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { Analytics } from "../_components/analytics";
import toast from "react-hot-toast";

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

    const [formEmail, setFormEmail] = useState<string>();
    const [formAmount, setFormAmount] = useState<number>();
    const [emailAddresses, setEmailAddresses] = useState<string[]>([]);
    const [initialLoad, setInitialLoad] = useState<boolean>(true);
    const [newEmail, setNewEmail] = useState<string>();
    const [removeEmail, setRemoveEmail] = useState<string>();

    useEffect( () => {
        if (!initialLoad) return

        const receivedData : any[] = data;
        try {
            setEmailAddresses(receivedData.map( (val) => val.email));
            setInitialLoad(false);
        } catch (err) {}
    }, [data, initialLoad])

    const makePayment = async () => {
        const email = formEmail;
        const amount = formAmount;

        if (!email) {
            toast.error("Select a valid user")
        } else if (!amount) {
            toast.error("Input a non-zero amount")
        } else {
            toast.promise(
                axios.post("/api/makePayment", {email: email, amount: amount}),
                {
                    error: `Couldn't add payment`,
                    loading: "Making Payment",
                    success: `Paid $${amount} to ${email}`
                }
            )
        }
    }

    const addUser = async () => {
        const email = newEmail;

        if (!email || !email.includes("@gmail.com")) {
            toast.error("Input a valid Gmail address")
            return
        }

        toast.promise(
            axios.post("/api/addUser", {email: email}),
            {
                error: `Couldn't add user: ${email}`,
                loading: `Adding User`,
                success: `Added User: ${email}`
            }
        )
    }

    const removeUser = async () => {
        const email = removeEmail;
        if (!email) {
            toast.error(`Select a valid user to remove`);
            return
        }

        toast.promise(
            axios
              .post('/api/removeUser', {email: email}),
            {
                error: `Couldn't remove ${email}`,
                loading: `Removing...`,
                success: `Removed user: ${email}`
            }
          );
    }

    if (isLoading) {
        return <h1 className="font-bold">Loading...</h1>
    } else if (error) {
        return <h1 className="font-bold">Not a registered Admin</h1>
    } else {
        return (
            <div className="flex flex-col h-full w-full gap-3">
    
                <div className="flex w-full flex-col gap-2">
                    <h1 className="font-bold w-full">Make Custom Payment</h1>
                    <div className="flex w-full">
                        <select 
                            className="p-2"
                            name="Select User" 
                            onChange={(e) => setFormEmail(e.target.value)}
                        >
                            <option value="" className="brightness-50">Select a User</option>
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

                <div className="flex w-full flex-col gap-2">
                    <h1 className="font-bold">Manage Users</h1>

                    <input
                        type="string"
                        placeholder="Enter Gmail Address"
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="p-2 w-48"
                    />
                    <button
                        className="p-3 bg-black font text-white rounded-lg w-48 hover:brightness-50"
                        onClick={addUser}
                    >
                        Add New User
                    </button>

                    <div className="w-full flex">
                        <select 
                            className="p-2"
                            name="Select User"
                            onChange={(e) => setRemoveEmail(e.target.value)}
                        >
                            <option value="" className="brightness-50">Select a User</option>
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
                    
                    <button
                        className="p-3 bg-black font text-white rounded-lg w-48 hover:brightness-50"
                        onClick={removeUser}
                    >
                        Remove User
                    </button>
                </div>
    
                {data ? <Analytics data={data} monthlyFee={100}/> : null}
            </div>
        )
    }
}