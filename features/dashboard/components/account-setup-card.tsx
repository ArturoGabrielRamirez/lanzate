import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Circle } from "lucide-react"
import { getAccountSetupDataAction } from "@/features/dashboard/actions/getAccountSetupDataAction"
import { CreateStoreButton } from "@/features/stores/components"
import { getUserInfo } from "@/features/layout/actions"
import UnifiedCreateProductButton from "@/features/products/components/unified-create-product-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SettingsLinks from "./settings-links"
import CopyLink from "./copy-link"
/* import UnifiedCreateProductButton from "@/features/products/components/unified-create-product-button" */

const AccountSetupCard = async () => {
    const { payload: user } = await getUserInfo()

    if (!user) return null

    const { payload } = await getAccountSetupDataAction()

    const storeDone = !!payload && payload.storeCount > 0
    const productDone = !!payload && payload.productCount > 0
    const settingsDone = !!payload && payload.hasOperationalSettings

    const totalSteps = 4
    const completedSteps = [storeDone, productDone, settingsDone].filter(Boolean).length || 1
    const progress = (completedSteps / totalSteps) * 100

    console.log("🚀 ~ productDone:", productDone)
    return (
        <Card className="!gap-2">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <p>Account Setup</p>
                    <p className="text-muted-foreground/50">step {completedSteps} of {totalSteps}</p>
                </CardTitle>
                <Progress value={progress} className="w-full" />
            </CardHeader>
            <CardContent>
                <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                        {storeDone ? (
                            <CheckCircle className="size-4 text-primary/50 group-hover/setup:text-primary transition-all" />
                        ) : (
                            <Circle className="size-4 text-muted-foreground/50" />
                        )}
                        <p className={storeDone ? "line-through text-muted-foreground/50" : ""}>Create a store</p>
                    </li>
                    <li className="flex items-center gap-2">
                        {productDone ? (
                            <CheckCircle className="size-4 text-primary/50 group-hover/setup:text-primary transition-all" />
                        ) : (
                            <Circle className="size-4 text-muted-foreground/50" />
                        )}
                        <p className={productDone ? "line-through text-muted-foreground/50" : ""}>Add your first product</p>
                    </li>
                    <li className="flex items-center gap-2">
                        {settingsDone ? (
                            <CheckCircle className="size-4 text-primary/50 group-hover/setup:text-primary transition-all" />
                        ) : (
                            <Circle className="size-4 text-muted-foreground/50" />
                        )}
                        <p className={settingsDone ? "line-through text-muted-foreground/50" : ""}>Choose selling options</p>
                    </li>
                    <li className="flex items-center gap-2">
                        <Circle className="size-4 text-muted-foreground/50" />
                        <p>Share your link!</p>
                    </li>
                </ul>
            </CardContent>
            <CardFooter>
                {!storeDone && <CreateStoreButton userId={user?.id} canCreate={!storeDone} />}
                {!productDone && storeDone && <UnifiedCreateProductButton userId={user?.id} storeId={payload?.stores[0]?.id} stores={payload?.stores} />}
                {productDone && !settingsDone && (
                    <SettingsLinks stores={payload?.stores || []} />
                )}
                {settingsDone && (
                    <CopyLink stores={payload?.stores || []}/>
                )}
            </CardFooter>
        </Card>
    )
}
export default AccountSetupCard