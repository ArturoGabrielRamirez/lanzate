"use client"

import { Store } from "@/prisma/generated/prisma"
import { useRouter } from "next/navigation"

type Props = {
    store: Store
}

function StoreCard({ store }: Props) {

    const router = useRouter()

    const handleClick = () => {
        router.push(`/stores/${store.slug}`)
    }

    return (
        <article key={store.id} className="border-2 border-secondary rounded-md p-4 hover:scale-105 transition-all bg-accent text-accent-foreground cursor-pointer" onClick={handleClick}>
            <h2 className="text-2xl font-bold">{store.name}</h2>
        </article>
    )
}

export default StoreCard
