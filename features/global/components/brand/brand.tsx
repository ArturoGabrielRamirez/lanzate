import { Store } from "lucide-react"
import { cn } from "@/features/shadcn/utils/cn"
import {
    brandContainerVariants,
    brandIconContainerVariants,
    brandIconVariants,
    brandTextVariants,
} from "./brand-variants"
import type { BrandProps } from "@/features/global/types/brand.types"

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
                <Store className={brandIconVariants({ color, size })} />
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
