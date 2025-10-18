import { getStoreBasicsBySlugAction } from "@/features/stores/actions"
import { StoreCardLogo } from "@/features/stores/components"
import { StoreHeaderServerProps } from "@/features/stores/types"


async function StoreHeaderServer({ slug }: StoreHeaderServerProps) {

    const { payload: store, hasError, message } = await getStoreBasicsBySlugAction(slug)

    if (hasError || !store) {
        return <div>Error loading store header: {message || "Unknown error"}</div>
    }

    return (
        <header>
            <div className="flex gap-4 mb-4">
                <StoreCardLogo logo={store.logo || ""} name={store.name || ""} className="block size-12 lg:size-20" />
                <h2 className="text-2xl lg:text-4xl font-bold truncate">
                    {store.name}
                </h2>
            </div>
        </header>
    )
}

export { StoreHeaderServer }
