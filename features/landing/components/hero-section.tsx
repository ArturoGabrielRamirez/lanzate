import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import heroImage from "@/features/landing/assets/Startup life-pana 1.svg";
import { BackgroundPattern, HeroDescription } from "@/features/landing/components";
import { Announcement, AnnouncementTitle, AnnouncementTag } from "@/features/shadcn/components/shadcn-io/announcement";
import { RotatingText } from "@/features/shadcn/components/shadcn-io/rotating-text";

async function HeroSection() {

    const t = await getTranslations("home")

    const words = [t("slogan.word-1"), t("slogan.word-2"), t("slogan.word-3")]

    return (
        <section className="min-h-dvh relative pt-17 flex">
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-[1fr_auto] md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:items-end relative md:pb-12 lg:pb-20">
                <div className="flex flex-col items-center pt-4 md:items-start md:pt-0 z-10">
                    <Announcement className="border-primary mb-12">
                        <AnnouncementTag className="bg-primary/20">
                            {t('announcement.last-update')}
                        </AnnouncementTag>
                        <AnnouncementTitle>
                            {t('announcement.title')}
                            <ArrowUpRightIcon className="shrink-0 text-muted-foreground" size={16} />
                        </AnnouncementTitle>
                    </Announcement>
                    <h1 className="flex flex-col justify-end mb-6 text-5xl font-bold leading-none text-center sm:text-6xl lg:text-7xl xl:text-8xl md:text-left text-foreground font-oswald">
                        <span className="flex items-center gap-2 md:flex-row md:gap-4 justify-center md:justify-start">
                            <span className="pb-4">
                                {t("slogan.1")}
                            </span>
                            <RotatingText
                                className="text-primary"
                                text={words}
                                duration={4000}
                            />
                        </span>
                        <span className="text-primary flex gap-4 justify-center md:justify-start leading-8 md:leading-12 lg:leading-16 pb-0 md:pb-2 lg:pb-3">
                            Lanzate
                        </span>
                        <span className="leading-normal md:leading-none">
                            {t("slogan.finish")}
                        </span>
                    </h1>
                    <HeroDescription className="hidden md:flex" />
                </div>
                <HeroDescription className="flex md:hidden" />
                <div className="relative w-md xl:w-xl h-full flex items-end">
                    <Image
                        src={heroImage}
                        alt="Hero Image"
                        className="w-full antialiased object-contain object-bottom drop-shadow-md"
                        fill
                    />
                </div>
            </div>
            <BackgroundPattern />
        </section>
    )
}

export { HeroSection }