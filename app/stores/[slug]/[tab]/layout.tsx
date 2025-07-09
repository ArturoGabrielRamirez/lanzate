import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"

import { TabLayoutProps } from "@/features/stores/types"

async function TabLayout({ children, params }: TabLayoutProps) {

    const { tab } = await params

    const titles = {
        account: "Account Details",
        branches: "Branches",
        employees: "Employees",
        products: "Products",
        orders: "Orders",
        settings: "Settings",
        analytics: "Analytics",
    }

    return (
        <TabsContent value={tab}>
            <Card>
                <CardHeader>
                    <CardTitle>{titles[tab as keyof typeof titles]}</CardTitle>
                </CardHeader>
                <CardContent className="gap-4 flex flex-col">
                    {children}
                </CardContent>
            </Card>
        </TabsContent>
    )
}
export default TabLayout