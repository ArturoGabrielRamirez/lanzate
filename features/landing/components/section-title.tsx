import * as motion from "motion/react-client"
import { cn } from "@/lib/utils"
type Props = {
    title: string
    className?: string
}

function SectionTitle({ title, className }: Props) {
    return (
        <motion.h2
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className={cn("text-5xl font-bold text-center mb-4", className)}
        >
            {title}
        </motion.h2>
    )
}
export default SectionTitle