"use client"
import * as motion from "motion/react-client"
import { useTranslations } from "next-intl";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";
import EmblaCarousel from "./embla-carousel";

function FeaturesSection() {

    const t = useTranslations('home');

    const OPTIONS = { loop: true }
    const SLIDE_COUNT = 5
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
                <motion.h2
                    initial={{ opacity: 0, y: 100 }}
                    whileInView={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
                    className="text-5xl font-bold text-center mb-22"
                >
                    {t('description.how-it-work.description')}
                </motion.h2>
                <div className="mask-l-from-80% mask-l-to-95% mask-r-from-80% mask-r-to-95%">
                    <EmblaCarousel slides={SLIDES} options={OPTIONS} />
                </div>
            </div>
        </section>
    )
}
export default FeaturesSection