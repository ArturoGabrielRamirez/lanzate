import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CreateProductButton from "@/features/products/components/create-product-button"

type Props = {
    slug: string
    storeId: number
    userId: number
}

function QuickActionsBar({ slug, storeId, userId }: Props) {

    return (
        <Card className="grow hover:bg-accent transition-colors duration-200 justify-between">
            <CardHeader>
                <CardTitle className="font-bold text-2xl">Welcome!</CardTitle>
                <CardDescription>
                    Here you can find the most important actions for your store together with some quick links to get you started.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-4">
                    <h3 className="text-sm font-semibold">Acciones Rápidas</h3>
                    
                    <div className="flex flex-wrap gap-3">
                        {/* Create Product Button */}
                        <CreateProductButton storeId={storeId} userId={userId} />
                        
                        {/* Coming Soon Buttons */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="flex items-center opacity-50 h-full"
                            >
                                <span>Análisis Avanzado</span>
                            </Button>
                            <Badge 
                                variant="secondary" 
                                className="absolute -top-2 -right-2 text-xs px-1 py-0"
                            >
                                Coming Soon
                            </Badge>
                        </div>
                        
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled
                                className="flex items-center opacity-50 h-full"
                            >
                                <span>Marketing Tools</span>
                            </Button>
                            <Badge 
                                variant="secondary" 
                                className="absolute -top-2 -right-2 text-xs px-1 py-0"
                            >
                                Coming Soon
                            </Badge>
                        </div>

                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default QuickActionsBar 