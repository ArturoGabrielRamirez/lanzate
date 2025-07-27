import * as motion from "motion/react-client"

type Props = {
    title: string
}

function SectionTitle({ title }: Props) {
    return (
        <motion.h2
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
            className="text-5xl font-bold text-center mb-22"
        >
            {title}
        </motion.h2>
    )
}
export default SectionTitle