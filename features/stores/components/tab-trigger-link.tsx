"use client"

import { TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

type Props = {
    value: string
    text: string
    slug: string
}

function TabTriggerLink({ value, text, slug }: Props) {

    return (
        <TabsTrigger value={value} className="w-full h-fit cursor-pointer py-3" asChild>
            <Link href={`/stores/${slug}/${value}`}>
                {text}
            </Link>
        </TabsTrigger>
    )
}
export default TabTriggerLink