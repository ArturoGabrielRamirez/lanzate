"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Product } from "@prisma/client"
import Image from "next/image"
import AddToCartButton from "./add-to-cart-button"
import Link from "next/link"
import { useState } from "react"
import * as motion from "motion/react-client"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Eye, Heart, Share, ShoppingCart } from "lucide-react"

type Props = {
    product: Product
}

function GridCard({ product }: Props) {

    const [isFlipped, setIsFlipped] = useState(false)

    const handleFlip = () => {
        setIsFlipped(!isFlipped)
    }

    const handleShare = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
    }

    const handleAddToCart = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
    }

    const handleLike = (evt: React.MouseEvent<HTMLButtonElement>) => {
        evt.stopPropagation()
    }


    return (
        <div className="relative w-full h-fit" style={{ perspective: '1000px' }}>
            <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{
                    transformStyle: "preserve-3d",
                    width: '100%',
                    height: '100%'
                }}
            >
                <div
                    className="w-full h-full"
                    style={{
                        backfaceVisibility: 'hidden',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <Card className={cn("aspect-9/12 bg-[var(--product-card-background)] text-[var(--product-card-text)] w-full h-fit gap-2 !pt-0 group cursor-pointer")} onClick={handleFlip}>
                        <CardHeader className="gap-0 !px-0">
                            <div className="relative h-full overflow-hidden rounded-md rounded-b-none max-h-[200px]">
                                {product.image ? (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="rounded-md object-cover group-hover:scale-110 transition-all duration-300"
                                    />
                                ) : (
                                    <img src="https://api.dicebear.com/9.x/icons/svg?seed=boxes" alt="Product Image" className=" group-hover:scale-110 transition-all duration-300 opacity-50 group-hover:opacity-100 object-cover bg-center" />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="grow">
                            <div className="flex justify-between items-center text-foreground">
                                <Link href={`/item/${product.id}`}>
                                    <h3 className="text-lg font-medium group-hover:underline">{product.name}</h3>
                                </Link>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {product.description || "No description available for this product"}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <p className="font-bold text-xl">${product.price}</p>
                            <div className="flex gap-2">
                                <AddToCartButton product={product} />
                            </div>
                        </CardFooter>
                    </Card>
                </div>

                <div
                    className="absolute w-full h-full top-0 left-0"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        width: '100%',
                        height: '100%'
                    }}
                >
                    <Card className={cn("aspect-9/12 bg-[var(--product-card-background)] text-[var(--product-card-text)] w-full h-fit gap-2 !pt-0 cursor-pointer")} onClick={handleFlip}>
                        <div className="flex items-center justify-center h-full">
                            <div className="flex flex-col items-center justify-center gap-4">
                                <h3 className="text-lg font-medium text-center mb-4">{product.name}</h3>
                                <div className="flex flex-col gap-3">
                                    <IconButton
                                        animate
                                        icon={Share}
                                        className="text-white bg-primary hover:bg-primary/80"
                                        size="md"
                                        onClick={handleShare}
                                    />
                                    <IconButton
                                        icon={Heart}
                                        className="text-white bg-primary hover:bg-primary/80"
                                        size="md"
                                        onClick={handleLike}
                                    />
                                    <IconButton
                                        icon={ShoppingCart}
                                        className="text-white bg-primary hover:bg-primary/80"
                                        size="md"
                                        onClick={handleAddToCart}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground text-center mt-4">
                                    Click to flip back
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </motion.div>
        </div>
    )
}

export default GridCard 