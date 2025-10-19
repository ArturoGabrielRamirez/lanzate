import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getStoresFromUser } from "@/features/stores/actions/get-stores-from-user.action"
import StoreSelector from "./store-selector"

async function StoreSelectorContainer() {
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

    return <StoreSelector stores={stores} />
}

export default StoreSelectorContainer 