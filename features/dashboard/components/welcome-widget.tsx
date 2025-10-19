import { WelcomeWidgetProps } from "@/features/dashboard/types"
import { PageHeader } from "@/features/layout/components"

function WelcomeWidget({ user }: WelcomeWidgetProps) {
    return (
        <PageHeader
            title={`Hola, ${user.first_name}!`}
            subtitle={<span>Welcome back to <span className="text-primary">Lanzate</span></span>}
        />
    )
}

export { WelcomeWidget }