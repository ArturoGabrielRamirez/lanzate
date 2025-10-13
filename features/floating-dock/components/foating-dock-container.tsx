import { FloatingDock } from "@/features/floating-dock/components/floating-dock"
import { getUserInfo } from "@/features/layout/actions"

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