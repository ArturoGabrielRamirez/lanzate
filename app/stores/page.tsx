import Title from "@/features/layout/components/title"
import { getStoresFromUser } from "@/features/stores/actions/getStoresFromUser"
import CreateStoreButton from "@/features/stores/components/create-store-button"

type Props = {}
async function StoresPage({ }: Props) {

    const { payload, error, message } = await getStoresFromUser()

    if (error) {
        console.error(message)
    }

    return (
        <div className="p-4">
            <Title title="Stores" />
            {payload.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {payload.map((store) => (
                        <div key={store.id}>
                            <h2>{store.name}</h2>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col justify-center items-center h-full border-dashed border-2 border-secondary rounded-md p-6 gap-4">
                    <p className="text-xl font-bold">No stores found</p>
                    <CreateStoreButton />
                </div>
            )}
        </div>
    )
}
export default StoresPage