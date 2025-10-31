"use client"

import { Crown, Heart, Share, ShoppingCart } from "lucide-react"
import * as motion from "motion/react-client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"


import { AddToCartButton } from "@/features/products/components/add-to-cart-button"
import type { GridCardProps } from "@/features/products/types"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/features/shadcn/components/ui/card"
import { cn } from "@/lib/utils"

function GridCard({ product, href }: GridCardProps) {

    const [isFlipped, setIsFlipped] = useState(false)

    const canBeAddedToCart = product.stock > 0 && product.stock !== null && product.is_active && product.is_published

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
        <div className="relative w-full h-full" style={{ perspective: '1000px' }}>
            <motion.div
                className="relative w-full h-full"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
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
                    {/* <Card className={cn("bg-[var(--product-card-background)] text-[var(--product-card-text)] w-full h-full gap-2 !pt-0 group cursor-pointer")} onClick={handleFlip}> */}
                    <Card className={cn("rounded-none hover:rounded-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 w-full h-full gap-2 !pt-0 group/card cursor-pointer")} onClick={handleFlip}>
                        <CardHeader className="gap-0 !px-0 ">
                            <div className="relative w-full aspect-[1/0.7] overflow-hidden rounded-none group-hover/card:rounded-md rounded-b-none transition-all duration-300 group-hover/card:rounded-b-none">
                                <Image
                                    src={product.image || "/public-store/avatar.svg"}
                                    alt={product.name}
                                    fill
                                    className={cn(
                                        "object-cover group-hover/card:scale-110 transition-all duration-300 contrast-50 group-hover/card:contrast-100",
                                        !product.is_active && "grayscale"
                                    )}
                                />
                                <div className="absolute top-2 left-2 flex gap-2">
                                    {product.is_featured && <Crown className="text-yellow-500" />}
                                    {!product.is_active && (
                                        <Badge className="text-blue-500 border-blue-500 bg-black/30 backdrop-blur-sm text-sm">
                                            Próximamente
                                        </Badge>
                                    )}
                                    {product.created_at > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                                        <Badge className="text-green-500 border-green-500 bg-black/30 backdrop-blur-sm text-sm">
                                            Nuevo
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grow">
                            <div className="flex justify-between items-center text-foreground">
                                <Link href={href} onClick={(evt) => { evt.stopPropagation() }}>
                                    <h3 className="text-lg font-medium group-hover/card:underline">{product.name}</h3>
                                </Link>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {product.description || "No description available for this product"}
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                            <p className="font-bold text-xl">${product.price}</p>
                            <div className="flex gap-2">
                                <AddToCartButton product={product} canBeAddedToCart={canBeAddedToCart} />
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
                    <Card className={cn("bg-[var(--product-card-background)] text-[var(--product-card-text)] w-full h-full gap-2 !pt-0 cursor-pointer")} onClick={handleFlip}>
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

export { GridCard } 