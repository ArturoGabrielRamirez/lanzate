import { ElementType } from "react"

import { cn } from "@/lib/utils"

function SectionSubtitleSmall({ children, className, as = "h3", ...props }: { children: React.ReactNode, className?: string , as ?: ElementType} & React.HTMLAttributes<HTMLHeadingElement>) {

    const Comp = as as ElementType

    return (
        <Comp className={cn("text-xl font-bold font-oswald", className)} {...props}>
            {children}
        </Comp>
    )
}

export { SectionSubtitleSmall }