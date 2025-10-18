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
        <Avatar className={cn("aspect-square size-12 lg:size-20 shrink-0 border-2 border-primary hidden md:block", className)}>
            <AvatarImage src={logo} alt={name} asChild className="aspect-square">
                <Image src={logo} alt={name} width={32} height={32} unoptimized className="aspect-square" />
            </AvatarImage>
            <AvatarFallback>
                <StoreIcon className="size-8 lg:size-10 text-primary group-hover:text-primary transition-all" />
            </AvatarFallback>
        </Avatar>
    )
}

export { StoreCardLogo }