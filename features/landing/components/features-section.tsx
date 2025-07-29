"use client"
import * as motion from "motion/react-client"
import { useTranslations } from "next-intl";
import EmblaCarousel from "./embla-carousel";
import SectionTitle from "./section-title";

function FeaturesSection() {

    const t = useTranslations('home');

    const OPTIONS = { loop: true }
    //const SLIDE_COUNT = 3
    //const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
    const SLIDES = [
        {
            title: t('description.centralize.title'),
            description: t('description.centralize.description'),
            image: "/landing/feature-1.jpg"
        },
        {
            title: t('description.ship-easily.title'),
            description: t('description.ship-easily.description'),
            image: "/landing/feature-2.jpg"
        },
        {
            title: t('description.sell.title'),
            description: t('description.sell.description'),
            image: "/landing/feature-3.jpg"
        }
    ]

    return (
        <section className="p-6 pt-16 md:pt-0">
            <div className="container mx-auto">
                <motion.p
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="block mb-2 text-xs font-medium tracking-widest text-center uppercase text-muted-foreground/50"
                >
                    {t('description.how-it-work.title')}
                </motion.p>
                <SectionTitle title={t('description.how-it-work.description')} className="mb-22" />
                <div className="mask-l-from-80% mask-l-to-100% mask-r-from-80% mask-r-to-95%">
                    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
                </div>
            </div>
        </section>
    )
}
export default FeaturesSection