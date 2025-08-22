import { cn } from "@/lib/utils"

type PageContainerProps = {
    children: React.ReactNode
    className?: string
}
const PageContainer = ({ children, className }: PageContainerProps) => {
    return (
        <section className={cn("p-2 flex flex-col pt-13 md:pt-24 relative pb-24 container mx-auto z-10 xs:px-0", className)}>
            {children}
        </section>
    )
}
export default PageContainer