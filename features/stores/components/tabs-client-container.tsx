"use client"

import { Tabs } from "@/components/ui/tabs"
import { usePathname } from "next/navigation"

type Props = {
    children: React.ReactNode
}
function TabsClientContainer({ children }: Props) {

    const pathname = usePathname()
    const tab = pathname.split("/").pop()

    return (
        <Tabs defaultValue={tab} className="grid grid-cols-1 md:grid-cols-[300px_1fr] grid-rows-[auto_1fr] md:grid-rows-[1fr] w-full md:gap-4">
            {children}
        </Tabs>
    )
}
export default TabsClientContainer