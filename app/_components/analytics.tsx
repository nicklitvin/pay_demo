import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

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
            <div className="w-full flex items-center flex-col gap-2">
                <h1 className="font-bold">Monthly Transactions</h1>
                <table className="w-full">
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
                                <td className="p-1 text-center">{new Date(val.date).toLocaleString()}</td>
                                <td className="p-1 text-center">{val.amount}</td>
                                <td className="p-1 text-center">{String(val.admin)}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <button 
                    className="p-3 bg-black text-white rounded-xl hover:brightness-50"
                    onClick={() => router.push(`/admin/user/${user.email}`)}
                >
                    Show All Transactions
                </button>
            </div>
        )
    }

    const makeUserSummary = (user : UserSummary) => {
        return (
            <div key={user.email} className="w-2/5 min-w-[500px] border-1 flex flex-col p-3 bg-orange-300 rounded-lg gap-3 items-center">
                <div className="flex w-full gap-3 items-center">
                    <h1 className="font-bold w-[200px] break-words text-center">{user.email}</h1>
                    <div className="flex-1"/>
                    <h1 className="text-center">{`Owes ${user.owes}`}</h1>
                    <button 
                        className="bg-black text-white p-2 rounded-xl text-center hover:brightness-50"
                        onClick={() => makePayment(user.email, user.owes)}
                    >
                        Forgive
                    </button>
                    <button 
                        className="bg-black min-w-[100px] text-white p-2 rounded-xl text-center hover:brightness-50"
                        onClick={() => changeOpenUser(user.email)}
                    >
                        {openedUsers.includes(user.email) ? `See Less` : `See More`}
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
            <div className="flex flex-col w-full mt-3">
                <h1 className="font-bold">Analytics</h1>
                <h1>{`Progress: ${data.length - incompleteUsers.length}/${data.length}`}</h1>
                <div 
                    className="h-6 bg-red-700 rounded-full"
                    style={{width: totalProgressLength}}
                >
                    <div 
                        className="w-36 h-6 bg-green-700 rounded-full"
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