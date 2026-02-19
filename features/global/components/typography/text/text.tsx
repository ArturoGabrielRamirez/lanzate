import * as React from "react"

import { Typography } from "@/features/global/components/typography/typography/typography"
import { TextProps } from "@/features/global/types/text.types"
import { TypographyVariant } from "@/features/global/types/typography"


const Text = React.forwardRef<HTMLElement, TextProps>(
    ({ size = "base", ...props }, ref) => {
        const variantMap: Record<string, TypographyVariant> = {
            lg: "large",
            base: "p",
            sm: "small",
            xs: "muted",
            "2xs": "2xs",
        }

        return (
            <Typography
                ref={ref}
                variant={variantMap[size]}
                {...props}
            />
        )
    }
)
Text.displayName = "Text"

export { Text }
