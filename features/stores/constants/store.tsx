import { Boxes, Building2, ChartLine, Clock, Settings, ShoppingCart, Store, UsersRound } from "lucide-react"

export const STORES_NAVIGATION_LINKS = [
    {
        label: "Cuenta",
        description: "Gestiona la cuenta de tu tienda.",
        href: "/account",
        icon: <Store className="size-[inherit]" />
    },
    {
        label: "Productos",
        description: "Gestiona los productos de tu tienda.",
        href: "/products",
        icon: <Boxes className="size-[inherit]" />
    },
    {
        label: "Ordenes",
        description: "Gestiona las ordenes de tu tienda.",
        href: "/orders",
        icon: <ShoppingCart className="size-[inherit]" />
    },
    {
        label: "Sucursales",
        description: "Gestiona las sucursales de tu tienda.",
        href: "/branches",
        icon: <Building2 className="size-[inherit]" />
    },
    {
        label: "Empleados",
        description: "Gestiona los empleados de tu tienda.",
        href: "/employees",
        icon: <UsersRound className="size-[inherit]" />
    },
    {
        label: "Ajustes",
        description: "Gestiona la configuración de tu tienda.",
        href: "/settings",
        icon: <Settings className="size-[inherit]" />
    },
    {
        label: "Análisis",
        description: "Gestiona los análisis de tu tienda.",
        href: "/analytics",
        icon: <ChartLine className="size-[inherit]" />
    },
    {
        label: "Historial",
        description: "Gestiona el historial de tu tienda.",
        href: "/history",
        icon: <Clock className="size-[inherit]" />
    }
]