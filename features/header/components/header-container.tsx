"use client"
import { useAnimate, useMotionValueEvent, useScroll } from "motion/react"
import * as motion from "motion/react-client"

type Props = {
    children: React.ReactNode
}
function HeaderContainer({ children }: Props) {

    const { scrollYProgress } = useScroll()
    const [headerScope, animateHeader] = useAnimate()

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (latest > scrollYProgress.getPrevious()!) {
            animateHeader(headerScope.current, { backgroundColor: "rgba(0, 0, 0, 0.8)" })
            if (latest > 0.15) {
                animateHeader(headerScope.current, { opacity: 0, y: -100 })
            }
        } else {
            animateHeader(headerScope.current, { opacity: 1, y: 0 })
            if (latest < 0.15) {
                animateHeader(headerScope.current, { backgroundColor: "rgba(0, 0, 0, 0)" })
            }
        }
    })

    return (
        <motion.header
            className="flex items-center justify-between w-full bg-transparent backdrop-blur-[3px] text-accent-foreground px-2 py-2 md:py-4 md:px-4 fixed top-0 left-0  right-0 z-50 gap-2"
            ref={headerScope}
        >
            <motion.div className="flex items-center justify-between w-full mx-auto container">
                {children}
            </motion.div>
        </motion.header>
    )
}
export default HeaderContainer