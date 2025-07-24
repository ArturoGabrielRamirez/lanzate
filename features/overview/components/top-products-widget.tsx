import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Crown } from "lucide-react"
import { TopProductData } from "../types"

type Props = {
    data: TopProductData[]
}

function TopProductsWidget({ data }: Props) {

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
                    Productos Más Vendidos
                </CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {data.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No hay datos de ventas disponibles
                        </p>
                    ) : (
                        data.map((product, index) => (
                            <div key={product.productId} className="flex items-center space-x-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                                    {index + 1}
                                </div>
                                
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={product.image} alt={product.productName} />
                                    <AvatarFallback>
                                        {product.productName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {product.productName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {product.totalSold} vendidos
                                    </p>
                                </div>
                                
                                <div className="text-right">
                                    <p className="text-sm font-medium">
                                        {formatCurrency(product.revenue)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default TopProductsWidget 