import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Store, Eye, Activity } from "lucide-react"
import { ProductStoreCountData } from "../types"

type Props = {
    data: ProductStoreCountData
}

function ProductStoreCountWidget({ data }: Props) {

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Productos y Sucursales
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                            <Package className="h-4 w-4 text-blue-500" />
                            <div>
                                <div className="text-2xl font-bold">{data.totalProducts}</div>
                                <p className="text-xs text-muted-foreground">Productos totales</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Store className="h-4 w-4 text-green-500" />
                            <div>
                                <div className="text-2xl font-bold">{data.totalStores}</div>
                                <p className="text-xs text-muted-foreground">Sucursales</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                        <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-emerald-500" />
                            <div>
                                <div className="text-sm font-medium">{data.activeProducts}</div>
                                <p className="text-xs text-muted-foreground">Activos</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-purple-500" />
                            <div>
                                <div className="text-sm font-medium">{data.publishedProducts}</div>
                                <p className="text-xs text-muted-foreground">Publicados</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ProductStoreCountWidget 