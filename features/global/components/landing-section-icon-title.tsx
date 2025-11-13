import { LandingSectionTitle } from "@/features/global/components/landing-section-title"
import { LandingSectionIconTitleProps } from "@/features/global/types/types"
import { cn } from "@/lib/utils"

function LandingSectionIconTitle({ icon, children, containerClassName, titleClassName }: LandingSectionIconTitleProps) {
    return (
        <div className={cn("mb-2 flex items-center gap-2 text-primary justify-center md:justify-start", containerClassName)}>
            {icon}
            <LandingSectionTitle className={titleClassName}>{children}</LandingSectionTitle>
        </div>
    )
}

export { LandingSectionIconTitle }