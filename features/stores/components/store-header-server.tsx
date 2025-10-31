import { getStoreBasicsBySlugAction } from "@/features/stores/actions"
import { StoreHeaderClient } from "@/features/stores/components"
import { StoreHeaderProps } from "@/features/stores/types"


async function StoreHeaderServer({ slug }: StoreHeaderProps) {

    const { payload: store, hasError, message } = await getStoreBasicsBySlugAction(slug)

    if (hasError || !store) {
        return <div>Error loading store header: {message || "Unknown error"}</div>
    }

    return (
        <StoreHeaderClient store={store} />
    )
}

export { StoreHeaderServer }
