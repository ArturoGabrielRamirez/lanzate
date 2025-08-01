import { ShoppingBasket } from "lucide-react"
import { Title } from "@/features/layout/components"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"
import { StoreSelector } from "@/features/sale/components"
import { getTranslations } from "next-intl/server"

async function SalePage() {
    const t = await getTranslations("sale")

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: stores, error: storesError, message: storesMessage } = await getStoresFromUser(user.id)

    if (storesError) {
        return console.error(storesMessage)
    }

    return (
        <section className="p-4 flex flex-col pt-17">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    {t("title")}
                </div>
            )} breadcrumbs={[{
                label: t("breadcrumbs.sale"),
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