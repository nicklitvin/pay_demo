"use client"

import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { useState } from "react"
import toast from "react-hot-toast";

type Action = "Pay" | "Add" | "Remove" | "History";
interface Content {
    title: string,
    subtitle: string,
    buttonText: string
}

const stuff : Record<Action, Content> = {
    "Pay": {
        title: "Make Custom Payment",
        subtitle: "",
        buttonText: ""
    },
    "Add": {
        title: "Add New User",
        subtitle: "",
        buttonText: ""
    },
    "History": {
        title: "View Transaction History",
        subtitle: "",
        buttonText: ""
    },
    "Remove": {
        title: "Remove User",
        subtitle: "",
        buttonText: ""
    }
}

const text = {
    selectUser: "Select A User",
    payButton: "Make Payment",
    addButton: "Add User",
    historyButton: "View History",
    removeButton: "Remove User"
}


interface Props {
    users: string[]
}

export default function AdminOptions( {users} : Props ) {
    const router = useRouter();

    const [selectedAction, setSelectedAction] = useState<Action>("Add");

    const [payEmail, setPayEmail] = useState<string>();
    const [payAmount, setPayAmount] = useState<number>();
    const [addEmail, setAddEmail] = useState<string>();
    const [historyEmail, setHistoryEmail] = useState<string>();
    const [removeEmail, setRemoveEmail] = useState<string>();

    const actionOption = (action : Action) => {
        return (
            <h1 className={classNames(
                selectedAction == action ? "text-first" : "text-second",
                "hover:text-first hover:cursor-pointer text-center"
            )}
                onClick={() => setSelectedAction(action)}
            >
                {stuff[action].title}
            </h1>
        )
    }

    const makePayment = async () => {
        const email = payEmail;
        const amount = payAmount;

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

    const viewHistory = async () => {
        const email = historyEmail;

        if (email) {
            const emailUrl = email.split("@")[0];
            router.push(`http://localhost:3000/history/${emailUrl}`);
    
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
            </div>
            <div className="flex justify-center">
                <h1 className="">
                    {stuff[selectedAction].subtitle}
                </h1>

                <div className={classNames(
                    selectedAction == "Pay" ? "block" : "hidden",
                    "flex flex-col gap-3 items-center"
                )}>
                    <select 
                        className="p-2 w-80"
                        onChange={(e) => setPayEmail(e.target.value)}
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
                        className="p-3 bg-first font text-back rounded-lg w-48 hover:brightness-50"
                        onClick={makePayment}
                    >
                        {text.payButton}
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
                    />
                    <button 
                        className="p-3 bg-first font text-back rounded-lg w-48 hover:brightness-50"
                        onClick={addUser}
                    >
                        {text.addButton}
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
                        {text.historyButton}
                    </button>
                </div>

                <div className={classNames(
                    selectedAction == "Remove" ? "block" : "hidden",
                    "flex flex-col gap-3 items-center"
                )}>
                    <select 
                        className="p-2 w-80"
                        onChange={(e) => setRemoveEmail(e.target.value)}
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
                        {text.removeButton}
                    </button>
                </div>

            </div>
        </div>
    )
}