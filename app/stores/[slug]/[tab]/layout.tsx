import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"

import { TabLayoutProps } from "@/features/stores/types"

async function TabLayout({ children, params }: TabLayoutProps) {

    const { tab } = await params

    const titles = {
        overview: "Overview",
        account: "Account Details",
        branches: "Branches",
        employees: "Employees",
        products: "Products",
        orders: "Orders",
        settings: "Settings",
        analytics: "Analytics",
        history: "History",
    }

    return (
        <TabsContent value={tab} className="flex flex-col">
            <Card className="grow">
                <CardHeader>
                    <CardTitle>{titles[tab as keyof typeof titles]}</CardTitle>
                </CardHeader>
                <CardContent className="gap-4 flex flex-col grow">
                    {children}
                </CardContent>
            </Card>
        </TabsContent>
    )
}

export default TabLayout