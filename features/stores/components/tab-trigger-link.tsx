"use client"

import { TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

import { TabTriggerLinkProps } from "@/features/stores/types"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
function TabTriggerLink({ value, text, slug, icon }: TabTriggerLinkProps) {

    const isActive = usePathname().includes(value)

    return (
        <TabsTrigger value={value} className={cn(
            "w-full h-fit cursor-pointer py-3 !text-muted-foreground/30 hover:!bg-muted hover:!text-muted-foreground",
            isActive && "!bg-primary !text-primary-foreground"
        )} asChild>
            <Link href={`/stores/${slug}/${value}`} className="min-w-16">
                <span className="">
                    {icon}
                </span>
                <span className="hidden xl:block">
                    {text}
                </span>
            </Link>
        </TabsTrigger>
    )
}
export default TabTriggerLink