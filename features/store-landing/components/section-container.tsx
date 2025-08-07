import { cn } from "@/lib/utils"

type Props = {
    children: React.ReactNode
    className?: string
}
const SectionContainer = ({ children, className }: Props) => {
    return (
        <div className={cn("p-4 grow flex flex-col", className)}>
            {children}
        </div>
    )
}
export default SectionContainer