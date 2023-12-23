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
    const data = {
        transactions: [
            {
                date: "2023-12-23T08:23:37.241Z",
                amount: 20,
                admin: false
            }, 
            {
                date: "2023-12-23T08:22:37.241Z",
                amount: 10,
                admin: true
            }, 
            {
                date: "2023-12-23T08:21:37.241Z",
                amount: 1,
                admin: true
            }
        ]
    }

    // const {data, isLoading, error } = useSWR(`/api/getUserTransactions/${params.email}`, (url) => axios.get(url).then(res => res.data));

    const makeTransactionDiv = (transaction : TransactionData) => {
        return (
            <div 
                className="bg-green-700 p-3 rounded-lg flex flex-row gap-5"
                key={`${transaction.date}-transaction`}
            >
                <h1 className="font-bold">{new Date(transaction.date).toLocaleString()}</h1>
                <h1 className="font-bold flex-1">{`Amount: $${transaction.amount}`}</h1>
                <h1 className="font-bold">{transaction.admin ? "Admin Payment" : "User Payment"}</h1>
            </div>
        )
    }

    let content;

    if (data) { 
        try {
            let myData : TransactionData[] = data.transactions;

            content = (
                <div className="w-full flex flex-col gap-3">
                    {myData.map( (val) => makeTransactionDiv(val))}
                </div>
            )
        } catch (err) {}
    }

    return (
        <div className="flex flex-col gap-3">
            <h1 className="font-bold">{`User: ${params.email}`}</h1>
            {content}
        </div>
    )
}