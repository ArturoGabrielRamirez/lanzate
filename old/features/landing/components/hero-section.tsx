import HeroDescription from "./hero-description";
import { Announcement, AnnouncementTitle, AnnouncementTag } from "@/components/ui/shadcn-io/announcement";
import { ArrowUpRightIcon } from "lucide-react";
import { RotatingText } from "@/components/ui/shadcn-io/rotating-text";
import { getTranslations } from "next-intl/server";
import { AnimatedBeamMultipleOutputDemo } from "@/features/layout/components/hero-image";

async function HeroSection() {

    const t = await getTranslations("home")
    const words = [t("slogan.word-1"), t("slogan.word-2"), t("slogan.word-3")]

    return (
        <section className="flex flex-col md:grid md:grid-cols-[1fr_auto] md:gap-0 xl:gap-20 2xl:gap- min-h-dvh justify-center items-center relative pt-17 px-4 lg:px-0 container mx-auto">
            <div className="flex flex-col items-center pt-4 md:items-start md:pt-0 z-10">
                <Announcement className="border-primary mb-4">
                    <AnnouncementTag className="bg-primary/20">Last update</AnnouncementTag>
                    <AnnouncementTitle>
                        New cash register added
                        <ArrowUpRightIcon className="shrink-0 text-muted-foreground" size={16} />
                    </AnnouncementTitle>
                </Announcement>
                <h1 className="flex flex-col justify-end gap-1 mb-8 text-5xl font-bold leading-none text-center sm:text-6xl lg:text-7xl xl:text-8xl md:text-left text-foreground">
                    <span className="flex items-center gap-2 md:flex-row md:gap-4 justify-center md:justify-start">
                        <span className="pb-3">
                            {t("slogan.1")}
                        </span>
                        <RotatingText
                            className="text-primary pb-3"
                            text={words}
                            duration={4000}
                        />
                    </span>
                    <span className="text-primary flex gap-4 justify-center md:justify-start pb-3">
                        Lanzate
                    </span>
                    <span className="text-foreground leading-normal md:leading-none">
                        makes it happen
                    </span>
                </h1>
                <HeroDescription className="hidden md:block" />
            </div>
            <HeroDescription className="block md:hidden" />
            <AnimatedBeamMultipleOutputDemo />
        </section>
    )
}
export default HeroSection