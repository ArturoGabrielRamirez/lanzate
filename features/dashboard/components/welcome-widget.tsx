import { WelcomeWidgetProps } from "@/features/dashboard/types"

function WelcomeWidget({ user }: WelcomeWidgetProps) {
    return (
        <header>
            <h2 className="text-2xl font-bold flex items-center gap-2">
                Hola, {user.first_name}!
            </h2>
            <p className="text-sm text-muted-foreground">
                Welcome back to <span className="text-primary">Lanzate</span>
            </p>
        </header>
    )
}

export { WelcomeWidget }