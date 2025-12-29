import { cn } from "@/lib/utils";

function LandingText({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <p className={cn("text-muted-foreground font-quattrocento", className)}>
            {children}
        </p>
    )
}

export { LandingText }