"use client"

import { Flame } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useOptimistic, useState, useTransition } from "react"

import { toggleLikeAction } from "@/features/products/actions/toggle-like.action"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/features/shadcn/components/ui/dialog"
import { cn } from "@/lib/utils"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"

type User = {
    id: number
    email: string
    first_name?: string | null
    last_name?: string | null
}

type Props = {
    productId: number
    user: User | null
    initialLiked: boolean
    initialCount: number
}

function LikeButtonClient({ productId, user, initialLiked, initialCount }: Props) {
    if (!user) {
        return <LikeButtonGuest initialCount={initialCount} />
    }

    return (
        <LikeButtonUser
            productId={productId}
            userId={user.id}
            initialLiked={initialLiked}
            initialCount={initialCount}
        />
    )
}

// Componente para usuarios no autenticados
function LikeButtonGuest({ initialCount }: { initialCount: number }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                        <Flame />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Inicia sesión para dar like</DialogTitle>
                        <DialogDescription>
                            Necesitas tener una cuenta para dar like a los productos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex gap-2 justify-end">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        <Link href="/auth/signin">
                            <Button>
                                Iniciar sesión
                            </Button>
                        </Link>
                    </div>
                </DialogContent>
            </Dialog>
            
            {initialCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                    {initialCount}
                </Badge>
            )}
        </div>
    )
}

// Componente para usuarios autenticados
function LikeButtonUser({
    productId,
    userId,
    initialLiked,
    initialCount
}: {
    productId: number
    userId: number
    initialLiked: boolean
    initialCount: number
}) {
    const [isLiked, setIsLiked] = useState(initialLiked)
    const [likesCount, setLikesCount] = useState(initialCount)
    const [isPending, startTransition] = useTransition()
    const [optimisticLike, addOptimisticLike] = useOptimistic(isLiked, (_currentState, newState) => {
        return newState as boolean
    })
    const [optimisticCount, addOptimisticCount] = useOptimistic(likesCount, (_currentState, newState) => {
        return newState as number
    })
    const pathname = usePathname()

    function handleToggleLike(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        e.preventDefault()

        // Actualizar inmediatamente el estado optimista
        if(isPending) return

        startTransition(async () => {
            const newLikedState = !optimisticLike
            const newCount = newLikedState ? optimisticCount + 1 : Math.max(0, optimisticCount - 1)
            
            addOptimisticLike(newLikedState)
            addOptimisticCount(newCount)
            
            try {
                const result = await toggleLikeAction(productId, userId, pathname)
                if (!result.hasError && result.payload) {
                    setIsLiked(result.payload.isLiked)
                    setLikesCount(result.payload.count)
                } else {
                    // Si hay error, revertir el estado optimista
                    setIsLiked(isLiked)
                    setLikesCount(likesCount)
                }
            } catch (error) {
                console.error("Error toggling like:", error)
                // Si hay error, revertir el estado optimista
                setIsLiked(isLiked)
                setLikesCount(likesCount)
            }
        })
    }

    return (
        <div className="flex items-center gap-2 relative group">
            <IconButton
                icon={()=><Flame className={cn(
                    "transition-colors",
                    optimisticLike && "fill-red-500 text-red-500"
                )}/>}
                active={optimisticLike}
                size="sm"
                onClick={handleToggleLike}
                className={cn(
                    "transition-colors border-none",
                    optimisticLike && " text-red-600 stroke-red-600",
                    isPending && "!animate-pulse"
                )}
                animate={isPending}
                color={optimisticLike ? [255, 0, 0] : [0, 0, 0]}
                transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10
                }}
            />
            {/* <Button
                variant="outline"
                size="icon"
                onClick={handleToggleLike}
                className={cn(
                    "transition-colors border-none",
                    optimisticLike && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
                    isPending && "!animate-pulse"
                )}
            >
                <Flame className={cn(
                    "transition-colors",
                    optimisticLike && "fill-red-500 text-red-500"
                )} />
            </Button> */}
            
            {optimisticCount > 0 && (
                <Badge 
                    variant="secondary" 
                    className={cn(
                        "text-xs transition-colors absolute -bottom-1 -right-1 rounded-full size-4 opacity-0 group-hover:opacity-100",
                        isPending && "animate-pulse"
                    )}
                >
                    {optimisticCount}
                </Badge>
            )}
        </div>
    )
}

export { LikeButtonClient } 