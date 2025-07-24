import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, ShoppingCart, TrendingUp } from "lucide-react"
import { SalesOverviewData } from "../types"

type Props = {
    data: SalesOverviewData
}

function SalesOverviewWidget({ data }: Props) {

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Resumen de Ventas
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="text-2xl font-bold">
                            {formatCurrency(data.totalRevenue)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Ingresos totales
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">{data.totalOrders}</div>
                                <p className="text-xs text-muted-foreground">Órdenes</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <div className="text-sm font-medium">
                                    {formatCurrency(data.averageOrderValue)}
                                </div>
                                <p className="text-xs text-muted-foreground">Promedio</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default SalesOverviewWidget 