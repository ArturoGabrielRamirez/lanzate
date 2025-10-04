import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
    className?: string
}
const SectionContainer = ({ children, className }: Props) => {
    return (
        <div className={cn("p-4 grow flex flex-col [padding-top:var(--section-padding-top)]", className)}>
            {children}
        </div>
    )
}
export default SectionContainer