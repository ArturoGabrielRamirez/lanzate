import { ArrowLeft, ArrowRight } from "lucide-react"

import { SectionContainerProps } from "@/features/stores/types"
import { Link } from "@/i18n/naviation"
import { cn } from "@/lib/utils"

function SectionContainer({ children, title, className, moreLink, goBackLink }: SectionContainerProps) {
    return (
        <div className={cn(className)}>
            <div className="flex items-center justify-between">
                {goBackLink && (
                    <ArrowLeft className="size-4" />
                )}
                <h2 className="text-base text-muted-foreground/50 mb-2">
                    {title}
                </h2>
                {moreLink && (
                    <Link href={moreLink} className="flex items-center gap-1 text-sm text-muted-foreground/50 hover:text-primary transition-colors">
                        Ver más
                        <ArrowRight className="size-4" />
                    </Link>
                )}
            </div>
            {children}
        </div>
    )
}

export { SectionContainer }