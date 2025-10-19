import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { StoreSelector } from "@/features/sale/components/store-selector"
import { getStoresFromUserAction } from "@/features/stores/actions"

async function StoreSelectorContainer() {
    const { payload: user, hasError: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        console.error(userMessage)
        return null
    }

    const { payload: stores, hasError: storesError, message: storesMessage } = await getStoresFromUserAction(user.id)

    if (storesError || !stores) {
        console.error(storesMessage)
        return null
    }

    return <StoreSelector stores={stores} />
}

export default StoreSelectorContainer 