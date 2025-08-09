import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { canCreateStore } from "@/features/stores/access/canCreateStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateStoreButton, StoreCard } from "@/features/stores/components"
import { Plus } from "lucide-react"
import { getTranslations } from "next-intl/server"

async function StoresContainer() {
    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    const { payload: stores, error: storesError, message: storesMessage } = await getStoresFromUser(user.id)

    if (storesError || !stores) {
        console.error(storesMessage)
        return null
    }

    const canCreate = await canCreateStore(user.id)
    const t = await getTranslations("store")

    return (
        <>
            {stores.length > 0 ? (
                <section className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus />
                                <h2 className="text-2xl font-bold">{t("buttons.new-store")}</h2>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center items-center grow">
                            <CreateStoreButton userId={user.id} canCreate={canCreate} />
                        </CardContent>
                    </Card>
                    {stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </section>
            ) : (
                <div className="flex flex-col justify-center items-center h-full border-dashed border-2 border-secondary rounded-md p-6 gap-4">
                    <p className="text-xl font-bold">{t("no-stores")}</p>
                    <CreateStoreButton userId={user.id} canCreate={canCreate} />
                </div>
            )}
        </>
    )
}

export default StoresContainer 