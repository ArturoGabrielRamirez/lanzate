import { PageHeader } from "@/features/dashboard/components/page-header"
import { WelcomeWidgetProps } from "@/features/dashboard/types"

function WelcomeWidget({ user }: WelcomeWidgetProps) {
    return (
        <PageHeader
            title={`Hola, ${user.first_name}!`}
            subtitle={<span>Bienvenido a <span className="text-primary">Lanzate</span></span>}
        />
    )
}

export { WelcomeWidget }