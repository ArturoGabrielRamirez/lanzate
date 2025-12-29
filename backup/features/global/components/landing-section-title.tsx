import { LandingSectionTitleProps } from "@/features/global/types/types"
import { cn } from "@/lib/utils"

function LandingSectionTitle({ children, className }: LandingSectionTitleProps) {
    return (
        <h2 className={cn("text-2xl font-bold font-oswald", className)}>
            {children}
        </h2>
    )
}

export { LandingSectionTitle }