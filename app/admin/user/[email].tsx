import { useRouter } from "next/router"

export default function AllTransactions() {
    const router = useRouter();
    console.log(router.query.slug);
    return (
        <h1>ALL TRansactions</h1>
    )
}