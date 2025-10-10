"use client";

import { Sparkles } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import heroImage from "@/features/landing/assets/workinginhome.svg";


function HeroSection() {

    const t = useTranslations("landing");
    const tBrand = useTranslations("brand");

    return (
        <section className="min-h-dvh [background-image:radial-gradient(circle_at_top_left,#ffc074,#e67300)] dark:[background-image:radial-gradient(circle_at_top_left,#000000,#e67300)] transition-all flex">
            <div className="container mx-auto items-center md:items-end px-4 grid grid-cols-1 md:grid-cols-2 md:gap-30 pt-40 md:pb-20">
                <div className="">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 dark:text-primary text-primary-foreground border dark:border-primary/20 border-border w-fit mx-auto md:mx-0 mb-4 md:mb-0">
                        <Sparkles className="size-4" />
                        <span className="text-xs font-medium">{t("hero.just_released")}</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-extrabold text-primary-foreground mb-10 text-center md:text-left">
                        <span className="block">{t("hero.title-1")}</span>{" "}
                        <span className="text-primary block md:inline">
                            {tBrand("name")}
                        </span>
                        <span>{" "}</span>
                        <span >{t("hero.title-2")}</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-muted dark:text-muted-foreground mb-10 text-center md:text-left">
                        {t("hero.description")}
                    </p>
                    <motion.div whileTap={{ scale: 0.9, transition: { duration: 0.1 } }} className="w-fit mx-auto md:mx-0">
                        <Button size="lg" className="text-lg rounded-full mx-auto md:mx-0 block text-primary dark:text-primary-foreground h-14 dark:bg-primary/90 dark:hover:bg-background bg-background hover:text-primary-foreground shadow-2xl drop-shadow-2xl" asChild>
                            <Link href="/signup" className="flex items-center">
                                {t("hero.CTA-1")}
                            </Link>
                        </Button>
                    </motion.div>
                </div>
                <div className="mask-t-from-90%">
                    <Image
                        src={heroImage}
                        alt="Shopping"
                        className="w-full h-full object-cover"
                        width={500}
                        height={500}
                    />
                </div>
            </div>
        </section >
    )
};

export { HeroSection };
