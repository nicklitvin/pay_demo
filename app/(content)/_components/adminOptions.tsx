"use client"

import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react"
import toast from "react-hot-toast";

type Action = "Pay" | "Add" | "Remove" | "History" | "Analytics";
interface Content {
    title: string,
    subtitle: string,
    buttonText: string
}

const stuff : Record<Action, Content> = {
    "Pay": {
        title: "Make Custom Payment",
        subtitle: "Enter any amount to pay for the user (negative values accepted). \
        The payment will be recorded as done by an administrator.",
        buttonText: "Make Payment"
    },
    "Add": {
        title: "Add New User",
        subtitle: "Add a user to the payment system. They will be able to login \
        and complete payments. Must be a gmail account.",
        buttonText: "Add User"
    },
    "History": {
        title: "View Transaction History",
        subtitle: "See all transactions made by the user and the administrator",
        buttonText: "View History"
    },
    "Remove": {
        title: "Remove User",
        subtitle: "Remove the user from the system and the history of all of \
        their transactions. CANNOT be undone.",
        buttonText: "Remove"
    },
    "Analytics" : {
        title: "Analytics",
        subtitle: "Click on a user to view their transaction history. Forgiving \
        a user will fulfill their payments for the month.",
        buttonText: ""
    }
}

const text = {
    selectUser: "Select A User",
    incompletePayments: "Incomplete Payments: ",
    payRest: "Forgive",
    noUnpaid: "All users paid for this month. Nothing to see here.",
    monthlyPayment: 100
}

interface UserSummary {
    email: string,
    owes: number
}

interface Props {
    data: {email: string, transactions: any[]}[],
}

export default function AdminOptions( {data} : Props ) {
    const router = useRouter();
    const users = data.map( (val) => val.email);

    const incompleteUsers : UserSummary[] = data.map( (val) => {
        return {
            email: val.email,
            owes: val.transactions.reduce( (previous, current) => previous - current.amount, 100)
        }
    }).filter( (val) => val.owes > 0)

    const [selectedAction, setSelectedAction] = useState<Action>("Analytics");

    const [payEmail, setPayEmail] = useState<string>("");
    const [payAmount, setPayAmount] = useState<number>();
    const [addEmail, setAddEmail] = useState<string>("");
    const [historyEmail, setHistoryEmail] = useState<string>("");
    const [removeEmail, setRemoveEmail] = useState<string>("");

    const actionOption = (action : Action) => {
        return (
            <h1 className={classNames(
                selectedAction == action ? "text-first" : "text-second",
                "hover:text-first hover:cursor-pointer text-center text-lg"
            )}
                onClick={() => setSelectedAction(action)}
            >
                {stuff[action].title}
            </h1>
        )
    }

    const makePayment = async (email : string, amount : number) => {
        toast.promise(
            axios.post("/api/makePayment", {email: email, amount: amount}),
            {
                error: `Couldn't add payment`,
                loading: "Making Payment",
                success: () => {
                    setPayEmail("");
                    return `Paid $${amount} to ${email}`
                }
            }
        )
    }

    const makeCustomPayment = async () => {
        const email = payEmail;
        const amount = payAmount;

        if (!email) {
            toast.error("Select a valid user")
        } else if (!amount) {
            toast.error("Input a non-zero amount")
        } else {
            await makePayment(email, amount);
        }
    }


    const addUser = async () => {
        const email = addEmail;

        if (!email || !email.includes("@gmail.com")) {
            toast.error("Input a valid Gmail address")
            return
        }

        toast.promise(
            axios.post("/api/addUser", {email: email}),
            {
                error: `Couldn't add user: ${email}`,
                loading: `Adding User`,
                success: () => {
                    setAddEmail("")
                    return `Added User: ${email}`
                }
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
                success: () => {
                    setRemoveEmail("")
                    return `Removed user: ${email}`
                }
            }
          );
    }

    const viewHistory = async () => {
        const email = historyEmail;

        if (email) {
            const emailUrl = email.split("@")[0];
            router.push(`/history/${emailUrl}`);
    
        } else {
            toast.error("Cannot view History of undefined email");
        }
    }

    return (
        <div className="flex flex-col w-full gap-5">
            <div className="flex w-full justify-center gap-7">
                {actionOption("Add")}
                {actionOption("History")}
                {actionOption("Pay")}
                {actionOption("Remove")}
                {actionOption("Analytics")}
            </div>

            <div className="flex justify-center flex-col gap-3">
                <h1 className="text-center text-sm">
                    {stuff[selectedAction].subtitle}
                </h1>

                <div className={classNames(
                    selectedAction == "Pay" ? "block" : "hidden",
                    "flex flex-col gap-3 items-center"
                )}>
                    <select 
                        className="p-2 w-80"
                        onChange={(e) => setPayEmail(e.target.value)}
                        value={payEmail}
                    >
                        <option value="" className="brightness-50">{text.selectUser}</option>
                        {users.map( (val) => 
                            <option 
                                key={val} 
                                value={val} 
                                className="p-2"
                            >
                                {val}
                            </option>
                        )}
                    </select>
                    <div className="relative flex items-center">
                        <span className="absolute ml-2">
                            $
                        </span>
                        <input
                            type="number" 
                            placeholder="Enter Amount" 
                            onChange={(e) => setPayAmount(Number(e.target.value))}
                            className="p-2 indent-4 w-48"
                        />
                    </div>
                    <button 
                        className="p-3 bg-first font text-back rounded-lg w-48 hover:brightness-50 text-center"
                        onClick={makeCustomPayment}
                    >
                        {stuff.Pay.buttonText}
                    </button>
                </div>

                <div className={classNames(
                    selectedAction == "Add" ? "block" : "hidden",
                    "flex flex-col gap-3 items-center"
                )}>
                    <input
                        type="string"
                        placeholder="Enter Gmail Address"
                        onChange={(e) => setAddEmail(e.target.value)}
                        className="p-2 w-80"
                        value={addEmail}
                    />
                    <button 
                        className="p-3 bg-first font text-back rounded-lg w-48 hover:brightness-50 text-center"
                        onClick={addUser}
                    >
                        {stuff.Add.buttonText}
                    </button>
                </div>

                <div className={classNames(
                    selectedAction == "History" ? "block" : "hidden",
                    "flex flex-col gap-3 items-center"
                )}>
                    <select 
                        className="p-2 w-80"
                        onChange={(e) => setHistoryEmail(e.target.value)}
                    >
                        <option value="" className="brightness-50">{text.selectUser}</option>
                        {users.map( (val) => 
                            <option 
                                key={val} 
                                value={val} 
                                className="p-2"
                            >
                                {val}
                            </option>
                        )}
                    </select>
                    <button 
                        className="p-3 bg-first font text-back rounded-lg w-48 hover:brightness-50"
                        onClick={viewHistory}
                    >
                        {stuff.History.buttonText}
                    </button>
                </div>

                <div className={classNames(
                    selectedAction == "Remove" ? "block" : "hidden",
                    "flex flex-col gap-3 items-center"
                )}>
                    <select 
                        className="p-2 w-80"
                        onChange={(e) => setRemoveEmail(e.target.value)}
                        value={removeEmail}
                    >
                        <option value="" className="brightness-50">{text.selectUser}</option>
                        {users.map( (val) => 
                            <option 
                                key={val} 
                                value={val} 
                                className="p-2"
                            >
                                {val}
                            </option>
                        )}
                    </select>
                    <button 
                        className="p-3 bg-first font text-back rounded-lg w-48 hover:brightness-50"
                        onClick={removeUser}
                    >
                        {stuff.Remove.buttonText}
                    </button>
                </div>

                <div className={classNames(
                    selectedAction == "Analytics" ? "block" : "hidden",
                    "flex flex-col gap-3 items-center"
                )}>
                    {incompleteUsers.map( (val) => (
                            <div key={val.email} className="flex gap-3">
                                <button
                                    className="text-back bg-first p-3 rounded-xl hover:brightness-75"
                                    onClick={() => router.push(`/history/${val.email.split("@")[0]}`)}
                                >
                                    {`${val.email} owes $${val.owes}`}
                                </button>
                                <button
                                    className="text-back bg-second p-3 rounded-xl hover:brightness-75"
                                    onClick={() => makePayment(val.email, val.owes)}
                                >
                                    {text.payRest}
                                </button>
                            </div>
                    ))}
                    { incompleteUsers.length > 0 ? null :
                        <h1 className="font-bold">
                            {text.noUnpaid}
                        </h1>
                    }
                </div>
            </div>
        </div>
    )
}