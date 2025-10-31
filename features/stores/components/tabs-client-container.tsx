"use client"

import { usePathname } from "next/navigation"

import { Tabs } from "@/features/shadcn/components/ui/tabs"
import { TabProps } from "@/features/stores/types"

function TabsClientContainer({ children }: TabProps) {

    const pathname = usePathname()
    const tab = pathname.split("/").pop()

    return (
        <Tabs defaultValue={tab} className="grid grid-cols-1 md:grid-cols-[min-content_1fr] xl:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
            {children}
        </Tabs>
    )
}

export { TabsClientContainer }