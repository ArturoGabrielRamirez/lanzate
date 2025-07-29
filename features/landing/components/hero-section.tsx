import { AnimatedBeamMultipleOutputDemo } from "@/features/layout/components/hero-image";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import { ContainerTextFlip } from "@/components/ui/container-text-flip";
import HeroDescription from "./hero-description";
import { getTranslations } from "next-intl/server";


async function HeroSection() {

    const t = await getTranslations("home")
    const words = [t("slogan.word-1"), t("slogan.word-2"), t("slogan.word-3")]


    return (
        <section className="flex flex-col md:grid md:grid-cols-[auto_auto] md:gap-0 xl:gap-20 2xl:gap-56 min-h-dvh justify-center items-center relative pt-17 px-4 lg:px-0">
            <div className="flex flex-col items-center md:items-start xl:max-w-2xl pt-4 md:pt-0">
                <p className="text-sm font-medium bg-primary/20 text-primary-foreground px-2 py-1 rounded-full border-primary border line-clamp-1 mb-8 md:mb-4">
                    {t("hero.just_released")}
                </p>
                <h1 className="text-4xl font-bold leading-none sm:text-5xl flex flex-col gap-2 justify-end mb-0 md:mb-8 text-center md:text-left">
                    <span className="flex flex-col items-center md:flex-row gap-2 md:gap-4">
                        <span className="md:relative md:top-1 lg:static">
                            {t("slogan.1")}
                        </span>
                        <ContainerTextFlip words={words} className="text-5xl mx-auto md:mx-0" textClassName="text-6xl" />
                    </span>
                    <span className="text-primary">
                        {t("slogan.3")} {t("slogan.4")}
                    </span>
                </h1>
                <HeroDescription className="hidden md:block" />
            </div>
            <AnimatedBeamMultipleOutputDemo />
            <HeroDescription className="block md:hidden" />
            <DotPattern
                width={30}
                height={30}
                className={cn("[mask-image:linear-gradient(to_bottom_right,white,transparent_70%,transparent)] ")}
            />
        </section>
    )
}
export default HeroSection