import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ButtonWithPopup from "@/features/layout/components/button-with-popup"
import { getProductDetails } from "@/features/stores/actions/getProductDetails"
import { ArrowBigDown, ArrowLeft, Home, Trash2 } from "lucide-react"
import DeleteProductButton from "@/features/products/components/delete-product-button"
import EditProductButton from "@/features/products/components/edit-product-button"
import Link from "next/link"

type Props = {
    params: Promise<{ slug: string, id: string }>
}

async function ProductDetailPage({ params }: Props) {

    const { slug, id } = await params
    const { payload: product, error } = await getProductDetails(id)
    if (error || !product) {
        return console.log(error)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Link href={`/stores/${slug}/products`}>
                        <ArrowLeft className="size-4" />
                    </Link>
                    Product Details
                </CardTitle>
            </CardHeader>
            <CardContent className="grow flex">
                <div className="grid grid-cols-1 lg:grid-cols-[max-content_1fr] grid-rows-[auto_1fr] lg:grid-rows-1 gap-4 w-full">
                    <div className="w-full h-35 lg:h-full lg:w-60 xl:w-80 overflow-hidden rounded-md group bg-secondary">
                        <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="object-cover h-full w-full bg-center group-hover:scale-105 transition-all duration-300 scale-y-95 scale-x-93 rounded-md" />
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="text-4xl font-bold">{product.name}</h3>
                        <p className="text-muted-foreground text-lg">${product.price}</p>
                        <p>{product.description || "No description available"}</p>
                        <div className="flex gap-4 mt-auto justify-end">
                            <DeleteProductButton productId={product.id} slug={slug} />
                            <EditProductButton product={product} slug={slug} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default ProductDetailPage