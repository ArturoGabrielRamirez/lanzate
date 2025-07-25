import { ShoppingBasket } from "lucide-react"
import { Title } from "@/features/layout/components"
import { getStoresFromSlug } from "@/features/stores/actions/getStoresFromSlug"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
    params: Promise<{ slug: string }>
}

async function SaleStorePage({ params }: Props) {
    const { slug } = await params
    
    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.error(userMessage)
    }

    const { payload: store, error: storeError, message: storeMessage } = await getStoresFromSlug(slug)

    if (storeError || !store) {
        return console.error(storeMessage)
    }

    return (
        <section className="p-4 flex flex-col max-md:pt-24">
            <Title title={(
                <div className="flex items-center gap-2">
                    <ShoppingBasket />
                    New order - {store.name}
                </div>
            )} breadcrumbs={[
                {
                    label: "Sale",
                    href: "/sale"
                },
                {
                    label: store.name,
                    href: `/sale/${slug}`
                }
            ]} />
            
            <div className="mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Tienda Seleccionada: {store.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                {store.description || "Sin descripción disponible"}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium">Información de la tienda</h4>
                                    <p className="text-sm text-muted-foreground">Slug: {store.slug}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Sitio web: {store.subdomain}.lanzate.com
                                    </p>
                                </div>
                            </div>
                            
                            {/* Aquí puedes agregar la interfaz de ventas específica */}
                            <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                                <p className="text-muted-foreground">
                                    Interfaz de ventas para {store.name} - En desarrollo
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

export default SaleStorePage 