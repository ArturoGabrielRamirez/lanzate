import { StoreIcon } from "lucide-react"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface StoreCardLogoProps {
    logo: string
    name: string
    className?: string
}

function StoreCardLogo({ logo, name, className }: StoreCardLogoProps) {
    return (
        <Avatar className={cn("aspect-square size-8 lg:size-10 shrink-0 border-2 border-primary hidden md:block", className)}>
            <AvatarImage src={logo} alt={name} asChild className="aspect-square">
                <Image src={logo} alt={name} width={32} height={32} unoptimized className="aspect-square" />
            </AvatarImage>
            <AvatarFallback>
                <StoreIcon className="size-6 md:size-5 text-primary/50 group-hover:text-primary transition-all" />
            </AvatarFallback>
        </Avatar>
    )
}

export { StoreCardLogo }