import { cn } from "@/lib/utils"

function SmallMutedText({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <p className={cn("text-sm text-muted-foreground font-geist font-light", className)}>
            {children}
        </p>
    )
}

export { SmallMutedText }