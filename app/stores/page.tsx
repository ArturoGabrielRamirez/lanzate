import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import Title from "@/features/layout/components/title"
import { canCreateStore } from "@/features/stores/access/canCreateStore"
import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"
import CreateStoreButton from "@/features/stores/components/create-store-button"
import StoreCard from "@/features/stores/components/store-card"

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
                    <article className="border-2 border-secondary/50 rounded-md p-4 border-dashed grid place-content-center">
                        {!canCreate && (
                            <p className="text-red-500/50 mb-2">Free plan limit reached</p>
                        )}
                        <CreateStoreButton userId={user.id} canCreate={canCreate} />
                    </article>
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