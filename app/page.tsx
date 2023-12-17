"use client"

import axios from "axios"
import useSWR from "swr"

export default function Home() {
    const { data } = useSWR("/api/getUserData", (url) => axios.get(url).then(res => res.data) );

    if (data) {
        return (
            <>
                <h1>{`Signed in as ${data.email}`}</h1>
                <h1>{`Amount due: ${data.amountDue}`}</h1>
            </>
        )
    } else {
        return (
            <h1>Loading...</h1>
        )
    }
    
}
