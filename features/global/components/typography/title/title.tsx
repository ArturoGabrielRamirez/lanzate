import { TitleProps } from "@/features/global/types/title.types"
import { TypographyVariant } from "@/features/global/types/typography"
import * as React from "react"
import { Typography } from "@/features/global/components/typography/typography/typography"

const Title = React.forwardRef<HTMLElement, TitleProps>(
    ({ size = "md", ...props }, ref) => {
        const variantMap: Record<string, TypographyVariant> = {
            lg: "h2",
            md: "h3",
            sm: "h4",
        }

        return (
            <Typography
                ref={ref}
                variant={variantMap[size]}
                weight="semibold"
                {...props}
            />
        )
    }
)
Title.displayName = "Title"

export { Title }
