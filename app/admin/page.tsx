"use client"
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import useSWR from "swr";

export default function Admin() {
    const { data, isLoading, error } = useSWR("/api/getAdminData", (url) => axios.get(url).then(res => res.data) );
    let content;

    const makePayment = async () => {
        await axios.get("/api/makePayment");
    }

    if (data) {
        content = <h1>{JSON.stringify(data)}</h1>
    } else if (error) {
        content = <h1>Error with Admin</h1>
    } else {
        content = <h1>Loading...</h1>
    }

    return (
        <>
            <UserButton/>
            <button onClick={makePayment}>yessir</button>
            {content}
        </>
    )
}