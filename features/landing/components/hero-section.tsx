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
        <section className="min-h-dvh [background-image:radial-gradient(circle_at_bottom_center,#ffc074,#e67300)] md:[background-image:radial-gradient(circle_at_bottom_right,#ffc074,#e67300)] lg:[background-image:radial-gradient(circle_at_70%_80%,#ffc074,#e67300)] dark:[background-image:radial-gradient(circle_at_70%_80%,#e67300,#3a1d00,#000000)] transition-all flex">
            <div className="container mx-auto items-center md:items-end px-4 grid grid-cols-1 md:grid-cols-2 md:gap-30 pt-40 md:pb-20">
                <div className="pb-16">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 dark:text-primary text-primary-foreground border dark:border-primary/20 border-border w-fit mx-auto md:mx-0 mb-4 md:mb-0">
                        <Sparkles className="size-4" />
                        <span className="text-xs font-medium">{t("hero.just_released")}</span>
                    </div>
                    <h2 className="text-5xl lg:text-8xl font-extrabold text-primary-foreground mb-4 text-center md:text-left font-oswald">
                        <span className="block">{t("hero.title-1")}</span>{" "}
                        <span className="text-primary block md:inline brightness-75 dark:brightness-125">
                            {tBrand("name")}
                        </span>
                        <span>{" "}</span>
                        <span >{t("hero.title-2")}</span>
                    </h2>
                    <p className="text-xl md:text-2xl text-muted dark:text-muted-foreground mb-10 text-center md:text-left font-quattrocento font-light">
                        {t("hero.description")}
                    </p>
                    <motion.div whileTap={{ scale: 0.9, transition: { duration: 0.1 } }} className="w-fit mx-auto md:mx-0">
                        <Button size="lg" className=" rounded-full mx-auto md:mx-0 block text-primary dark:text-primary-foreground h-14 dark:bg-primary/90 dark:hover:bg-background bg-background hover:text-primary-foreground shadow-2xl drop-shadow-2xl border-t border-t-[color-mix(in_oklch,var(--primary),white_20%)] border-b border-b-[color-mix(in_oklch,var(--primary),black_20%)] hover:border-t-[color-mix(in_oklch,var(--primary),white_20%)] hover:border-b-[color-mix(in_oklch,var(--primary),black_20%)] dark:hover:border-t-[color-mix(in_oklch,var(--background),white_40%)] dark:hover:border-b-[color-mix(in_oklch,var(--background),black_40%)] font-lightp" asChild>
                            <Link href="/signup" className="flex items-center">
                                {t("hero.CTA-1")}!
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
