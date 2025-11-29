import { PageContainerProps } from "@/features/layout/types/page-container.types"
import { cn } from "@/lib/utils"

function PageContainer({ children, className }: PageContainerProps) {
    return (
        <section className={cn("p-2 flex flex-col pt-18 md:pt-20 relative xl:pb-4 container mx-auto z-10 px-4 grow pb-20", className)}>
            {children}
        </section>
    )
}

export { PageContainer }