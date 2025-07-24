import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"

import { TabLayoutProps } from "@/features/stores/types"
import { BookOpenText, Building2, UsersRound, Box, Store, ShoppingCart, Settings, ChartLine, Clock } from "lucide-react"

async function TabLayout({ children, params }: TabLayoutProps) {

    const { tab } = await params

    const titles = {
        overview: <><BookOpenText className="w-4 h-4" />Overview</>,
        account: <><Store className="w-4 h-4" />Account Details</>,
        branches: <><Building2 className="w-4 h-4" />Branches</>,
        employees: <><UsersRound className="w-4 h-4" />Employees</>,
        products: <><Box className="w-4 h-4" />Products</>,
        orders: <><ShoppingCart className="w-4 h-4" />Orders</>,
        settings: <><Settings className="w-4 h-4" />Settings</>,
        analytics: <><ChartLine className="w-4 h-4" />Analytics</>,
        history: <><Clock className="w-4 h-4" />History</>,
    }

    return (
        <TabsContent value={tab} className="flex flex-col">
            <Card className="grow">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">{titles[tab as keyof typeof titles]}</CardTitle>
                </CardHeader>
                <CardContent className="gap-4 flex flex-col grow">
                    {children}
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default TabLayout