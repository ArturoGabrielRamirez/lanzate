import { ShoppingBasket } from "lucide-react"
import { Title } from "@/features/layout/components"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"
import { StoreSelector } from "@/features/sale/components"

async function SalePage() {
    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: stores, error: storesError, message: storesMessage } = await getStoresFromUser(user.id)

    if (storesError) {
        return console.error(storesMessage)
    }

    return (
        <section className="p-4 flex flex-col max-md:pt-24">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    New order
                </div>
            )} breadcrumbs={[{
                label: "Sale",
                href: "/sale"
            }]} />
            
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full max-w-md">
                    <StoreSelector stores={stores} />
                </div>
            </div>
        </section>
    )
}

export default SalePage