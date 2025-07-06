import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import Title from "@/features/layout/components/title"
import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"
import CreateStoreButton from "@/features/stores/components/create-store-button"

type Props = {}
async function StoresPage({ }: Props) {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError) {
        return console.error(userMessage)
    }

    const { payload: stores, error: storesError, message: storesMessage } = await getStoresFromUser(user.id)

    if (storesError) {
        return console.error(storesMessage)
    }


    return (
        <div className="p-4">
            <Title title="Stores" />
            {stores.length > 0 ? (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stores.map((store) => (
                        <article key={store.id} className="border-2 border-secondary rounded-md p-4">
                            <h2>{store.name}</h2>
                        </article>
                    ))}
                </section>
            ) : (
                <div className="flex flex-col justify-center items-center h-full border-dashed border-2 border-secondary rounded-md p-6 gap-4">
                    <p className="text-xl font-bold">No stores found</p>
                    <CreateStoreButton userId={user.id} />
                </div>
            )}
        </div>
    )
}
export default StoresPage