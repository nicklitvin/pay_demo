"use client"

import { UserButton } from "@clerk/nextjs";
import axios from "axios"
import useSWR from "swr"

export default function Home() {
    const { data } = useSWR("/api/getUserData", (url) => axios.get(url).then(res => res.data) );

    let body;
    if (data) {
        body = (
            <>
                <h1>{`Signed in as ${data.email}`}</h1>
                <h1>{`Amount due: ${data.amountDue}`}</h1>
            </>
        )
    } else {
        body = (
            <h1>Loading...</h1>
        )
    }
    
    return (
        <>
            <UserButton/>
            {body}
        </>
    )
}
