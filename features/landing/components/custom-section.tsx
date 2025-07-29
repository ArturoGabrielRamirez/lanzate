import Link from "next/link"
import EyeCatchingButton from "./eye-catching-button"
import SectionTitle from "./section-title"
import * as motion from "motion/react-client"
import { getTranslations } from "next-intl/server"

async function CustomSection() {

    const t = await getTranslations('home')

    return (
        <div className="text-center bg-background py-10">
            <SectionTitle title={t('customization.title')} />
            <motion.p className="block text-xs font-medium tracking-widest text-center uppercase text-muted-foreground/50 mb-8">
                {t('customization.description')}
            </motion.p>
            <EyeCatchingButton asChild className="text-xl font-bold">
                <Link href="/signup">{t('buttons.get-started')}</Link>
            </EyeCatchingButton>
        </div>
    )
}
export default CustomSection