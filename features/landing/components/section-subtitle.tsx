import { cn } from "@/lib/utils"

function SectionSubtitle({ children, className, ...props }: { children: React.ReactNode, className?: string } & React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h2 className={cn("mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald", className)} {...props}>
            {children}
        </h2>
    )
}

export { SectionSubtitle }