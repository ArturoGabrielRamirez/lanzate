import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
    title: string
    className?: string
}

function SectionContainer({ children, title, className }: Props) {
    return (
        <div className={cn(className)}>
            <h2 className="text-base text-muted-foreground/50 mb-2">
                {title}
            </h2>
            {children}
        </div>
    )
}

export { SectionContainer }