import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, ShoppingCart, Users, Settings } from "lucide-react"
import Link from "next/link"

type Props = {
    slug: string
}

function QuickActionsBar({ slug }: Props) {

    const quickActions = [
        {
            label: "Nuevo Producto",
            href: `/stores/${slug}/products?create=true`,
            icon: Plus,
            variant: "default" as const
        },
        {
            label: "Ver Productos",
            href: `/stores/${slug}/products`,
            icon: Package,
            variant: "outline" as const
        },
        {
            label: "Ver Órdenes",
            href: `/stores/${slug}/orders`,
            icon: ShoppingCart,
            variant: "outline" as const
        },
        {
            label: "Empleados",
            href: `/stores/${slug}/employees`,
            icon: Users,
            variant: "outline" as const
        },
        {
            label: "Configuración",
            href: `/stores/${slug}/settings`,
            icon: Settings,
            variant: "outline" as const
        }
    ]

    return (
        <Card className="grow hover:bg-accent transition-colors duration-200">
            <CardHeader>
                <CardTitle className="font-bold text-2xl">Welcome!</CardTitle>
                <CardDescription>
                    Here you can find the most important actions for your store together with some quick links to get you started.
                </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
                    
                    <div className="flex flex-wrap gap-3">
                        {quickActions.map((action) => {
                            const IconComponent = action.icon
                            
                            return (
                                <Button
                                    key={action.label}
                                    variant={action.variant}
                                    size="sm"
                                    asChild
                                    className="flex items-center space-x-2"
                                >
                                    <Link href={action.href}>
                                        <IconComponent className="h-4 w-4" />
                                        <span>{action.label}</span>
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActionsBar 