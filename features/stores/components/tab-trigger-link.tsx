"use client"

import { TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

import { TabTriggerLinkProps } from "@/features/stores/types"

function TabTriggerLink({ value, text, slug, icon }: TabTriggerLinkProps) {

    return (
        <TabsTrigger value={value} className="w-full h-fit cursor-pointer py-3" asChild>
            <Link href={`/stores/${slug}/${value}`} className="min-w-12">
                <span className="">
                    {icon}
                </span>
                <span className="hidden md:block">
                    {text}
                </span>
            </Link>
        </TabsTrigger>
    )
}
export default TabTriggerLink