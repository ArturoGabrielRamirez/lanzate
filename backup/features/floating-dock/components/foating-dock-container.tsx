import { FloatingDock } from "@/features/floating-dock/components"
import { getUserInfo } from "@/features/global/actions"

async function FloatingDockContainer() {

    const { payload: user, hasError } = await getUserInfo()

    if (hasError || !user) {
        return null
    }

    return (
        <FloatingDock />
    )
}

export { FloatingDockContainer }