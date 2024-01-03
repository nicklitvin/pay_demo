import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import classNames from "classnames";

interface UserData {
    email: string,
    transactions: any[]
}

interface UserSummary {
    email: string,
    owes: number,
    data: UserData
}

interface Props {
    data: UserData[],
    monthlyFee: number
}

export function Analytics({ data, monthlyFee } : Props) {
    const totalProgressLength = 200;
    const router = useRouter();
    const [incompleteUsers, setIncompleteUsers] = useState<UserSummary[]>([]);
    const [openedUsers, setOpenedUsers] = useState<string[]>([]);

        useEffect( () => {  
        const result : UserSummary[] = []
        for (let user of data) {
            const totalPaid = user.transactions.reduce( (previous, current) => previous + current.amount,0);
            if (totalPaid < monthlyFee) {
                result.push({
                    email: user.email,
                    owes: monthlyFee - totalPaid,
                    data: user
                })
            }
        }
        setIncompleteUsers(result);
    }, [])


    const changeOpenUser = (email : string) => {
        if (openedUsers.includes(email)) {
            setOpenedUsers( openedUsers.filter( (val) => val !== email))
        } else {
            const copy = [...openedUsers];
            copy.push(email);
            setOpenedUsers(copy);
        }
    }

    const showTrasnsactions = (user : UserSummary) => {
        return (
            <div className="w-full flex items-center flex-col">
                <table className="w-full border-2">
                    <thead>
                        <tr>
                            <th className="p-2 border-2">Date</th>
                            <th className="p-2 border-2">Amount</th>
                            <th className="p-2 border-2">Made by Admin</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.data.transactions.map( (val,index) => 
                            <tr key={`${val.email}-${index}-transaction`}>
                                <td className="p-1 text-center border-2">{new Date(val.date).toLocaleString()}</td>
                                <td className="p-1 text-center border-2">{`$${val.amount}`}</td>
                                <td className="p-1 text-center border-2">{String(val.admin)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }

    const makeUserSummary = (user : UserSummary) => {
        return (
            <div key={user.email} className="w-full border-1 flex flex-col p-3 pl-10 pr-10 bg-primary rounded-lg gap-3 items-center">
                <div className="flex w-full gap-3 items-center">
                    <h1 className="font-bold w-[200px] break-words">{user.email}</h1>
                    <div className="flex-1"/>
                <h1 className="text-center font-bold p-3 bg-complement rounded-xl w-[150px] text-text">
                        {`Owes $${user.owes}`}
                    </h1>
                    <button 
                        className={classNames(
                            "bg-complement font-bold min-w-[100px] text-white p-3 rounded-xl text-center",
                            openedUsers.includes(user.email) ? "brightness-75 hover:brightness-50" : "brightness-100 hover:brightness-50"
                        )}
                        onClick={() => changeOpenUser(user.email)}
                    >
                        {openedUsers.includes(user.email) ? `See Less` : `See More`}
                    </button>
                    <button 
                        className="p-3 bg-complement text-white rounded-xl hover:brightness-50 font-bold"
                        onClick={() => router.push(`history/${user.email.split("@")[0]}`)}
                    >
                        Show All Transactions
                    </button>
                </div>
                
                {openedUsers.includes(user.email) ? showTrasnsactions(user) : null}
            </div>
        )
    }

    const makePayment = async (email : string, amount : number) => {
        try {
            await axios.post("/api/makePayment", {email: email, amount: amount});
            setIncompleteUsers(incompleteUsers.filter( (value) => value.email !== email));
            toast.success(`Forgave user: ${email}`);
        } catch (err) {
            toast.error(`Error`)
        }
    }

    return (
        <div className="flex flex-col gap-3">

            <div className="flex flex-col w-full">
                <h1 className="font-bold">Analytics</h1>
                <h1>{`Completed Subscriptions: ${data.length - incompleteUsers.length}/${data.length}`}</h1>
                <div 
                    className="h-6 bg-red-600 rounded-full"
                    style={{width: totalProgressLength}}
                >
                    <div 
                        className="w-36 h-6 bg-green-600 rounded-full"
                        style={{width: totalProgressLength * (data.length - incompleteUsers.length)/data.length}}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <h1 className="font-bold">Incomplete Payments</h1>
                <div className="flex flex-row w-full mt-3 gap-2 flex-wrap">
                    {incompleteUsers.map( (val) => makeUserSummary(val))}
                </div>
            </div>
        </div>
    )
}