"use client"
import useSWR from "swr";
import AdminOptions from "../_components/adminOptions";
import axios from "axios";

const text = {
    loading: "Loading...",
    unauthorized: "Unauthorized"
}

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


    if (isLoading) {
        return <h1 className="font-bold">{text.loading}</h1>
    } else if (error) {
        return <h1 className="font-bold">{text.unauthorized}</h1>
    } else {
        return <AdminOptions data={data}/>
    }
}