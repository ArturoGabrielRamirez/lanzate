import { StoreIcon } from "lucide-react"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StoreCardLogoProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"

function StoreCardLogo({ logo, name, className }: StoreCardLogoProps) {
    return (
        <Avatar className={cn("aspect-square size-10 lg:size-12 shrink-0 border-2 border-primary", className)}>
            <AvatarImage src={logo} alt={name} asChild className="aspect-square">
                <Image src={logo} alt={name} width={32} height={32} unoptimized className="aspect-square" />
            </AvatarImage>
            <AvatarFallback>
                <StoreIcon className="size-5 lg:size-6 text-primary group-hover:text-primary transition-all" />
            </AvatarFallback>
        </Avatar>
    )
}

export { StoreCardLogo }