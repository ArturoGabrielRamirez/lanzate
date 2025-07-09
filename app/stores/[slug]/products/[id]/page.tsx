import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { getProductDetails } from "@/features/stores/actions/getProductDetails"
import { Trash2 } from "lucide-react"
import DeleteProductButton from "@/features/products/components/delete-product-button"
import EditProductButton from "@/features/products/components/edit-product-button"

type Props = {
    params: Promise<{ slug: string, id: string }>
}

async function ProductDetailPage({ params }: Props) {

    const { slug, id } = await params
    const { payload: product, error } = await getProductDetails(id)
    console.log("🚀 ~ ProductDetailPage ~ product:", product)

    if (error || !product) {
        return console.log(error)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Product Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-[max-content_1fr] gap-4">
                    <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="lg:max-w-xs md:max-h-full w-full" />
                    <div>
                        <h3 className="text-4xl font-bold">{product.name}</h3>
                        <p className="text-muted-foreground text-lg">${product.price}</p>
                        <p>{product.description || "No description available"}</p>
                        <DeleteProductButton productId={product.id} slug={slug} />
                        <EditProductButton product={product} slug={slug} />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default ProductDetailPage