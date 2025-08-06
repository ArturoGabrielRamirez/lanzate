"use client"

import { Tabs } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"

import { TabClientContainerProps } from "@/features/stores/types"

function TabsClientContainer({ children }: TabClientContainerProps) {

    const pathname = usePathname()
    const tab = pathname.split("/").pop()

    return (
        <Tabs defaultValue={tab} className="grid grid-cols-1 md:grid-cols-[min-content_1fr] xl:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
            {children}
        </Tabs>
    )
}
export default TabsClientContainer