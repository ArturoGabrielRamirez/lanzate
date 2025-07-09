import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import Title from "@/features/layout/components/title"
import { canCreateStore } from "@/features/stores/access/canCreateStore"
import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"
import CreateStoreButton from "@/features/stores/components/create-store-button"
import StoreCard from "@/features/stores/components/store-card"
import { Plus } from "lucide-react"

type Props = {}

async function StoresPage({ }: Props) {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: stores, error: storesError, message: storesMessage } = await getStoresFromUser(user.id)

    if (storesError) {
        return console.error(storesMessage)
    }

    const canCreate = await canCreateStore(user.id)

    return (
        <div className="p-4">
            <Title title="Stores" />
            {stores.length > 0 ? (
                <section className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
                    <Card className="border-dashed">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus />
                                <h2 className="text-2xl font-bold">New store</h2>
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
                    <p className="text-xl font-bold">No stores found</p>
                    <CreateStoreButton userId={user.id} canCreate={canCreate} />
                </div>
            )}
        </div>
    )
}
export default StoresPage