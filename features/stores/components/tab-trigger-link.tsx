"use client"

import { TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

import { TabTriggerLinkProps } from "@/features/stores/types"

function TabTriggerLink({ value, text, slug }: TabTriggerLinkProps) {

    return (
        <TabsTrigger value={value} className="w-full h-fit cursor-pointer py-3" asChild>
            <Link href={`/stores/${slug}/${value}`}>
                {text}
            </Link>
        </TabsTrigger>
    )
}
export default TabTriggerLink