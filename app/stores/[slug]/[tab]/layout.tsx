import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TabsContent } from "@/components/ui/tabs"

type Props = {
    children: React.ReactNode
    params: Promise<{ tab: string }>
}

async function TabLayou({ children, params }: Props) {

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
export default TabLayou