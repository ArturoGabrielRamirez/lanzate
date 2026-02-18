import { Rocket } from "lucide-react"

import {
    brandContainerVariants,
    brandIconContainerVariants,
    brandIconVariants,
    brandTextVariants,
} from "@/features/global/components/brand/brand-variants"
import type { BrandProps } from "@/features/global/types/brand.types"
import { cn } from "@/features/shadcn/utils/cn"

function Brand({
    direction = "horizontal",
    align = "center",
    color = "primary",
    size = "md",
    showText = true,
    className,
    ...props
}: BrandProps) {
    return (
        <div
            className={cn(
                brandContainerVariants({ direction, align, size }),
                className
            )}
            {...props}
        >
            <div className={brandIconContainerVariants({ color, size })}>
                <Rocket className={brandIconVariants({ color, size })} />
            </div>
            {showText && (
                <span className={brandTextVariants({ color, size })}>
                    Lanzate
                </span>
            )}
        </div>
    )
}

export {
    Brand,
    brandContainerVariants,
    brandIconContainerVariants,
    brandIconVariants,
    brandTextVariants,
}
