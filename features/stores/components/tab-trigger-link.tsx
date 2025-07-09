"use client"

import { TabsTrigger } from "@/components/ui/tabs"
import { useQueryState } from "nuqs"
import Link from "next/link"

type Props = {
    value: string
    text: string
    slug: string
}

function TabTriggerLink({ value, text, slug }: Props) {

    /* const [tab, setTab] = useQueryState('tab')
    const [productId, setProductId] = useQueryState('product_id') */

    const handleClick = () => {
        /* setTab(value)
        setProductId(null) */
    }

    return (
        <TabsTrigger value={value} onClick={handleClick} className="w-full h-fit cursor-pointer py-3" asChild>
            <Link href={`/stores/${slug}/${value}`}>
                {text}
            </Link>
        </TabsTrigger>
    )
}
export default TabTriggerLink