"use client"
import * as motion from "motion/react-client"
import { useTranslations } from "next-intl";
import EmblaCarousel from "./embla-carousel";
import SectionTitle from "./section-title";

function FeaturesSection() {

    const t = useTranslations('home');

    const OPTIONS = { loop: true }
    const SLIDE_COUNT = 3
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())

    return (
        <section className="p-6">
            <div className="container mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-muted-foreground/50"
                >
                    {t('description.how-it-work.title')}
                </motion.p>
                <SectionTitle title={t('description.how-it-work.description')} />
                <div className="mask-l-from-80% mask-l-to-100% mask-r-from-80% mask-r-to-95%">
                    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
                </div>
            </div>
        </section>
    )
}
export default FeaturesSection