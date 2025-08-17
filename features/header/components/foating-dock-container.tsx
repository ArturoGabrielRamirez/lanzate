import { getUserInfo } from "@/features/layout/actions"
import FloatingDock from "./floating-dock"

const FloatingDockContainer = async () => {

    const { payload: user, error } = await getUserInfo()

    if (error || !user) {
        return null
    }

    return (
        <FloatingDock />
    )
}
export default FloatingDockContainer