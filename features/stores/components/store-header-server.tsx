import { PageHeader } from "@/features/layout/components"
import { getStoreBasicsBySlugAction } from "@/features/stores/actions"
import { StoreCardLogo, StoreHeaderClient } from "@/features/stores/components"
import { StoreHeaderServerProps } from "@/features/stores/types"


async function StoreHeaderServer({ slug }: StoreHeaderServerProps) {

    const { payload: store, hasError, message } = await getStoreBasicsBySlugAction(slug)

    if (hasError || !store) {
        return <div>Error loading store header: {message || "Unknown error"}</div>
    }

    return (
        <StoreHeaderClient store={store} />
    )
}

export { StoreHeaderServer }
