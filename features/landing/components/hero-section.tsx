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
    {/*         <div className="flex flex-col items-center pt-4 md:items-start xl:max-w-2xl md:pt-0">
                <p className="px-2 py-1 mb-8 text-sm font-medium border rounded-full bg-primary/20 text-primary-foreground border-primary line-clamp-1 md:mb-4">
                    {t("hero.just_released")}
                </p>
                <h1 className="flex flex-col justify-end gap-2 mb-0 text-4xl font-bold leading-none text-center sm:text-5xl md:mb-8 md:text-left">
                    <span className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                        <span className="md:relative md:top-1 lg:static">
                            {t("slogan.1")}
                        </span>
                        <ContainerTextFlip words={words} className="mx-auto text-5xl md:mx-0" textClassName="text-6xl" />
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
            /> */}
        </section>
    )
}
export default HeroSection