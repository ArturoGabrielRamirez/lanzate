"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { toggleLike } from "../actions/toggleLike"
import { Flame } from "lucide-react"
import { useOptimistic, useState, useTransition } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

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
}

function LikeButtonClient({ productId, user, initialLiked }: Props) {
    if (!user) {
        return <LikeButtonGuest />
    }

    return (
        <LikeButtonUser
            productId={productId}
            userId={user.id}
            initialLiked={initialLiked}
        />
    )
}

// Componente para usuarios no autenticados
function LikeButtonGuest() {
    const [open, setOpen] = useState(false)

    return (
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
    )
}

// Componente para usuarios autenticados
function LikeButtonUser({
    productId,
    userId,
    initialLiked
}: {
    productId: number
    userId: number
    initialLiked: boolean
}) {
    const [isLiked, setIsLiked] = useState(initialLiked)
    const [isPending, startTransition] = useTransition()
    const [optimisticLike, addOptimisticLike] = useOptimistic(isLiked, (_currentState, newState) => {
        return newState as boolean
    })
    const pathname = usePathname()

    function handleToggleLike(e: React.MouseEvent<HTMLButtonElement>) {
        e.stopPropagation()
        e.preventDefault()

        // Actualizar inmediatamente el estado optimista
        if(isPending) return

        startTransition(async () => {
            addOptimisticLike(!optimisticLike)
            try {
                const result = await toggleLike(productId, userId, pathname)
                if (!result.error) {
                    setIsLiked(result.payload.isLiked)
                } else {
                    // Si hay error, revertir el estado optimista
                    setIsLiked(isLiked)
                }
            } catch (error) {
                console.error("Error toggling like:", error)
                // Si hay error, revertir el estado optimista
                setIsLiked(isLiked)
            }
        })
    }

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={handleToggleLike}
            /* disabled={isPending} */
            className={cn(
                "transition-colors",
                optimisticLike && "bg-red-50 border-red-200 text-red-600 hover:bg-red-100",
                isPending && "!animate-pulse"
            )}
        >
            <Flame className={cn(
                "transition-colors",
                optimisticLike && "fill-red-500 text-red-500"
            )} />
        </Button>
    )
}

export default LikeButtonClient 