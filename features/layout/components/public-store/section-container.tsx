import { SectionContainerProps } from "@/features/layout/types/types"
import { cn } from "@/lib/utils"

function SectionContainer({ children, className }: SectionContainerProps) {
    return (
        <div className={cn("p-4 grow flex flex-col [padding-top:var(--section-padding-top)]", className)}>
            {children}
        </div>
    )
}

export { SectionContainer }