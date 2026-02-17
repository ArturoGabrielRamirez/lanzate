import * as React from "react"

import { HeroTextProps } from "@/features/global/types/hero-text"
import { Typography } from "@/features/global/components/typography/typography/typography"

const HeroText = React.forwardRef<HTMLElement, HeroTextProps>(
    ({ size = "base", ...props }, ref) => {
        return (
            <Typography
                ref={ref}
                variant={size === "lg" ? "h1" : "h2"}
                weight="bold"
                {...props}
            />
        )
    }
)
HeroText.displayName = "HeroText"

export { HeroText }
