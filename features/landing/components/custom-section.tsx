import Link from "next/link"
import EyeCatchingButton from "./eye-catching-button"
import SectionTitle from "./section-title"
import * as motion from "motion/react-client"

function CustomSection() {
    return (
        <div className="text-center bg-background py-10">
            <SectionTitle title={"Customise Your Product"} />
            <motion.p className="block text-xs font-medium tracking-widest text-center uppercase text-muted-foreground/50 mb-8">
                If you want to create a custom implementation of this product, please contact us.
            </motion.p>
            <EyeCatchingButton asChild className="text-xl font-bold">
                <Link href="/signup">Get Started</Link>
            </EyeCatchingButton>
        </div>
    )
}
export default CustomSection