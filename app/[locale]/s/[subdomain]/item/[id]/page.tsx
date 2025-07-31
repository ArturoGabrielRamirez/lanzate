import { Button } from "@/components/ui/button"
import { Title } from "@/features/layout/components"
import { getProductDetails } from "@/features/subdomain/actions/getProductDetails"
import { Category } from "@prisma/client"
import { Flame, ShoppingCart } from "lucide-react"

type Props = {
    params: Promise<{ id: string; subdomain: string }>
}

async function ProductDetailsPage({ params }: Props) {

    const { id, subdomain } = await params

    const { payload: product, error, message } = await getProductDetails(id, subdomain)

    if (error || !product) {
        return (
            <section className="p-4">
                <Title
                    title="Product Not Found"
                    breadcrumbs={[{ label: "Product Not Found", href: `/item/${id}` }]}
                />
                <p className="text-red-500 mt-4">{message}</p>
            </section>
        )
    }

    return (
        <section className="p-4 grow flex flex-col">
            <Title
                title={product.name}
                breadcrumbs={[{ label: product.name, href: `/item/${id}` }]}
            />

            <div className="grow flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(min(400px,100%),1fr)_1fr] gap-12 grow">
                    <div className="flex gap-8 border-r pr-8 border-muted-foreground">
                        {/* Product Image */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-4 bg-gray-100 rounded-lg p-4">
                                <div className="text-gray-400">
                                    <svg className="size-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 bg-gray-100 rounded-lg p-4">
                                <div className="text-gray-400">
                                    <svg className="size-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 bg-gray-100 rounded-lg p-4">
                                <div className="text-gray-400">
                                    <svg className="size-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-100 rounded-lg flex items-center justify-center grow">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="text-gray-400">
                                    <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            <Button>
                                <Flame />
                            </Button>
                            <Button>
                                <ShoppingCart />
                            </Button>
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 leading-[0.8]">{product.name}</h2>
                            {product.sku && (
                                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
                            )}
                        </div>

                        <div className="text-2xl font-bold text-green-600">
                            ${product.price}
                        </div>

                        {product.description && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                <p className="text-gray-700">{product.description}</p>
                            </div>
                        )}

                        {product.categories && product.categories.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.categories.map((category: Category) => (
                                        <span
                                            key={category.id}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                                        >
                                            {category.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ProductDetailsPage