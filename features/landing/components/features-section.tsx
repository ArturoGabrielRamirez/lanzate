"use client"
import * as motion from "motion/react-client"
import { useTranslations } from "next-intl";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image";

function FeaturesSection() {

    const t = useTranslations('home');

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
                <Carousel
                    plugins={[
                        Autoplay({ delay: 5000 })
                    ]}
                    opts={{ loop: true, inViewThreshold: 0.2 }}
                    className="container mx-auto mask-l-from-60% mask-l-to-90% mask-r-from-60% mask-r-to-90%"
                >
                    <CarouselContent className="">
                        <CarouselItem className="basis-1/2 grow ">
                            <motion.div
                                initial={{ scale: 0.75 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ amount: 0.8 }}
                                exit={{ scale: 0.75 }}
                                className="grid grid-cols-2 gap-1"
                            >
                                <motion.div className="flex flex-col p-8 h-full rounded-md bg-primary text-primary-foreground gap-22">
                                    <motion.div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent">
                                        1
                                    </motion.div>
                                    <p className="text-2xl font-semibold">
                                        <b>{t('description.centralize.title')}</b> {t('description.centralize.description')}
                                    </p>
                                    <div className="mt-2 w-full">
                                        <div className="h-1 bg-muted rounded-full overflow-hidden border border-muted">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: "0%" }}
                                                whileInView={{ width: "100%", transition: { duration: 5, delay: 5 } }}
                                                exit={{ width: "0%" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                                <div className="relative rounded-md overflow-hidden">
                                    <motion.div className="relative h-full" whileInView={{ scale: 1.5, transition: { duration: 5 } }} exit={{ scale: 1 }}>
                                        <Image
                                            src="/landing/feature-1.jpg"
                                            alt="Centralize"
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </CarouselItem>
                        <CarouselItem className="basis-1/2 grow">
                            <motion.div
                                initial={{ scale: 0.75 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ amount: 0.8 }}
                                exit={{ scale: 0.75 }}
                                className="grid grid-cols-2 gap-1"
                            >
                                <motion.div className="flex flex-col p-8 h-full rounded-md bg-primary text-primary-foreground gap-22">
                                    <motion.div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent">
                                        2
                                    </motion.div>
                                    <p className="text-2xl font-semibold">
                                        <b>{t('description.centralize.title')}</b> {t('description.centralize.description')}
                                    </p>
                                    <div className="mt-2 w-full">
                                        <div className="h-1 bg-muted rounded-full overflow-hidden border border-muted">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: "0%" }}
                                                whileInView={{ width: "100%", transition: { duration: 5, delay: 5 } }}
                                                exit={{ width: "0%" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                                <div className="relative rounded-md overflow-hidden">
                                    <motion.div className="relative h-full" whileInView={{ scale: 1.5, transition: { duration: 5 } }} exit={{ scale: 1 }}>
                                        <Image
                                            src="/landing/feature-1.jpg"
                                            alt="Centralize"
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </CarouselItem>
                        <CarouselItem className="basis-1/2 grow">
                            <motion.div
                                initial={{ scale: 0.75 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ amount: 0.8 }}
                                exit={{ scale: 0.75 }}
                                className="grid grid-cols-2 gap-1"
                            >
                                <motion.div className="flex flex-col p-8 h-full rounded-md bg-primary text-primary-foreground gap-22">
                                    <motion.div className="flex items-center justify-center flex-shrink-0 w-12 h-12 text-xl font-bold rounded-full bg-accent">
                                        3
                                    </motion.div>
                                    <p className="text-2xl font-semibold">
                                        <b>{t('description.centralize.title')}</b> {t('description.centralize.description')}
                                    </p>
                                    <div className="mt-2 w-full">
                                        <div className="h-1 bg-muted rounded-full overflow-hidden border border-muted">
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: "0%" }}
                                                whileInView={{ width: "100%", transition: { duration: 5, delay: 5 } }}
                                                exit={{ width: "0%" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                                <div className="relative rounded-md overflow-hidden">
                                    <motion.div className="relative h-full" whileInView={{ scale: 1.5, transition: { duration: 5 } }} exit={{ scale: 1 }}>
                                        <Image
                                            src="/landing/feature-1.jpg"
                                            alt="Centralize"
                                            fill
                                            className="object-cover"
                                        />
                                    </motion.div>
                                </div>
                            </motion.div>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}
export default FeaturesSection