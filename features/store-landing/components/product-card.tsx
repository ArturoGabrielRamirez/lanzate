"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/features/cart/components/cart-provider"
import { Product } from "@prisma/client"
import { ShoppingCart } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useStore } from "./store-provider"

type Props = {
    product: Product
}

function ProductCard({ product }: Props) {

    const router = useRouter()
    const { addToCart } = useCart()
    const { displayType } = useStore()

    const handleClick = () => {
        router.push(`/item/${product.id}`)
    }

    const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        addToCart({
            id: product.id.toString(),
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image || ""
        })
    }

    if (displayType === "list") {
        return (
            <Card className="flex flex-row gap-2" onClick={handleClick}>
                <CardHeader className="grid grid-cols-[max-content_1fr] gap-2 w-full grid-rows-1">
                    <div className="relative h-full grow max-w-40 aspect-square w-full">
                        {product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="rounded-md object-cover"
                            />
                        ) : (
                            <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="rounded-md" />

                        )}
                    </div>
                    <div>
                        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                        <CardDescription className="line-clamp-2 h-11">{product.description || "No description available for this product"}</CardDescription>
                    </div>
                </CardHeader>
                <CardFooter className="flex justify-between items-center flex-col">
                    <p className="text-xl font-bold">${product.price}</p>
                    <Button variant="outline" size="icon" onClick={handleAddToCart}>
                        <ShoppingCart />
                    </Button>
                </CardFooter>
            </Card >
        )
    }


    return (
        <Card className="aspect-9/12 bg-accent hover:scale-105 transition-all cursor-pointer object-cover w-full h-fit gap-2" onClick={handleClick}>
            <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription className="line-clamp-2 h-11">{product.description || "No description available for this product"}</CardDescription>
            </CardHeader>
            <CardContent className="grow">
                <div className="relative h-full">
                    {product.image ? (
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                        />
                    ) : (
                        <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className="rounded-md" />

                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p>${product.price}</p>
                <Button variant="outline" size="icon" onClick={handleAddToCart}>
                    <ShoppingCart />
                </Button>
            </CardFooter>
        </Card>
    )
}
export default ProductCard