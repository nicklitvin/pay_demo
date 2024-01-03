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

const text = {
    loading: "Loading...",
    unauthorized: "Unauthorized or no such user"
}


export default function AllTransactions({params} : Props) {
    // const { data, isLoading, error } = {
    //     data : {
    //         transactions: [
    //             {
    //                 date: "2023-12-23T08:23:37.241Z",
    //                 amount: 20,
    //                 admin: false
    //             }, 
    //             {
    //                 date: "2023-12-23T08:22:37.241Z",
    //                 amount: 10,
    //                 admin: true
    //             }, 
    //             {
    //                 date: "2023-12-23T08:21:37.241Z",
    //                 amount: 1,
    //                 admin: true
    //             }
    //         ]
    //     },
    //     isLoading: false,
    //     error: false
    // }

    const {data, isLoading, error } = useSWR(`/api/getUserTransactions/${params.email.split("@gmail.com")[0]}`, (url) => axios.get(url).then(res => res.data));

    const makeTransactionDiv = (transaction : TransactionData) => {
        return (
            <div 
                className="bg-primary p-3 rounded-lg flex flex-row gap-5 justify-center"
                key={`${transaction.date}-transaction`}
            >
                <h1 className="">{new Date(transaction.date).toLocaleString()}</h1>
                <h1 className="">{`Amount: $${transaction.amount}`}</h1>
                <h1 className="">{transaction.admin ? "Admin Payment" : "User Payment"}</h1>
            </div>
        )
    }

    if (isLoading) {
        return <h1 className="font-bold">{text.loading}</h1>
    } else if (error) {
        return <h1 className="font-bold">{text.unauthorized}</h1>
    } else {
        let myData : TransactionData[] = data.transactions;

        return ( 
            <div className="flex flex-col gap-3 items-center">
                <h1 className="">{`User: ${params.email}@gmail.com`}</h1>
                <div className="w-full flex flex-col gap-3">
                    {myData.map( (val) => makeTransactionDiv(val))}
                </div>
            </div>
        )
    }
}