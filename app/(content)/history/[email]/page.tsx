"use client"
import axios from "axios"
import useSWR from "swr"

interface Props {
    params: {email: string}
}

interface TransactionData {
    date: string 
    amount: number 
    admin: boolean
}


export default function AllTransactions({params} : Props) {
    // const data = {
    //     transactions: [
    //         {
    //             date: "2023-12-23T08:23:37.241Z",
    //             amount: 20,
    //             admin: false
    //         }, 
    //         {
    //             date: "2023-12-23T08:22:37.241Z",
    //             amount: 10,
    //             admin: true
    //         }, 
    //         {
    //             date: "2023-12-23T08:21:37.241Z",
    //             amount: 1,
    //             admin: true
    //         }
    //     ]
    // }

    const {data, isLoading, error } = useSWR(`/api/getUserTransactions/${params.email.split("@gmail.com")[0]}`, (url) => axios.get(url).then(res => res.data));

    const makeTransactionDiv = (transaction : TransactionData) => {
        return (
            <div 
                className="bg-primary p-3 rounded-lg flex flex-row gap-5"
                key={`${transaction.date}-transaction`}
            >
                <h1 className="font-bold">{new Date(transaction.date).toLocaleString()}</h1>
                <h1 className="font-bold flex-1">{`Amount: $${transaction.amount}`}</h1>
                <h1 className="font-bold">{transaction.admin ? "Admin Payment" : "User Payment"}</h1>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div>
                <h1 className="font-bold">Loading...</h1>
            </div>
        )
    } else if (data) {
        try {
            let myData : TransactionData[] = data.transactions;

            return (
                <div className="flex flex-col gap-3">
                    <h1 className="font-bold text-2xl">{`User: ${params.email}@gmail.com`}</h1>
                    <div className="w-full flex flex-col gap-3">
                        {myData.map( (val) => makeTransactionDiv(val))}
                    </div>
                </div>
            )
        } catch (err) {
            return (
                <div>
                    <h1 className="font-bold">There is an error with server output</h1>
                </div>
            )
        }
    } else if (error) {
        return (
            <div className="flex items-center flex-col flex-1">
                <h1 className="font-bold text-2xl">Error With Request</h1>
                <h1 className="text-center">{`You are either not authorized to view the history belonging to ${params.email}@gmail.com or there was an internal server error`}</h1>
            </div>
        )
    } else {
        return (
            <div>
                <h1 className="font-bold text-2xl">This is not a valid user</h1>
            </div>
        )
    }
}