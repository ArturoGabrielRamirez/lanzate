import { ArrowUpRightIcon } from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import heroImage from "@/features/landing/assets/Startup life-pana 1.svg";
import { HeroDescription, LandingSectionWrapper } from "@/features/landing/components";
import { Announcement, AnnouncementTitle, AnnouncementTag } from "@/features/shadcn/components/shadcn-io/announcement";
import { RotatingText } from "@/features/shadcn/components/shadcn-io/rotating-text";
import { Link } from "@/i18n/naviation";
import packageJson from "@/package.json";

async function HeroSection() {

    const t = await getTranslations("landing.hero")

    const words = [t("slogan.rotatingWords.word1"), t("slogan.rotatingWords.word2"), t("slogan.rotatingWords.word3")]

    return (
        <LandingSectionWrapper
            className="min-h-dvh"
            containerClassName="flex flex-col md:grid md:grid-cols-[1fr_auto] md:gap-0 xl:gap-20 2xl:gap-22 justify-center items-center md:items-end relative md:pb-12 lg:pb-20"
        >
            <div className="flex flex-col items-center pt-4 md:items-start md:pt-0 z-10">
                <Announcement className="border-primary mb-12" asChild>
                    <Link href="/waitlist">
                        <AnnouncementTag className="bg-primary/20">
                            {t('announcement.badge')}
                        </AnnouncementTag>
                        <AnnouncementTitle>
                            {/* NPM package.json version number */}
                            {packageJson.version}
                            {" "}
                            {t('announcement.title')}
                            <ArrowUpRightIcon className="shrink-0 text-muted-foreground" size={16} />
                        </AnnouncementTitle>
                    </Link>
                </Announcement>
                <h1 className="flex flex-col justify-end mb-6 text-5xl font-bold leading-none text-center sm:text-6xl lg:text-7xl xl:text-8xl md:text-left text-foreground font-oswald">
                    <span className="flex items-center gap-2 md:flex-row md:gap-4 justify-center md:justify-start">
                        <span className="pb-4">
                            {t("slogan.prefix")}
                        </span>
                        <RotatingText
                            className="text-primary"
                            text={words}
                            duration={4000}
                        />
                    </span>
                    <span className="text-primary flex gap-4 justify-center md:justify-start leading-8 md:leading-12 lg:leading-16 pb-0 md:pb-2 lg:pb-3">
                        {t("slogan.brandName")}
                    </span>
                    <span className="leading-normal md:leading-none">
                        {t("slogan.suffix")}
                    </span>
                </h1>
                <HeroDescription className="hidden md:flex" />
            </div>
            <HeroDescription className="flex md:hidden" />
            <div className="relative w-full md:w-md xl:w-xl h-full flex items-end">
                <Image
                    src={heroImage}
                    alt="Hero Image"
                    className="w-full antialiased object-contain object-bottom drop-shadow-xl drop-shadow-primary/30 dark:drop-shadow-primary/20"
                    fill
                />
            </div>
        </LandingSectionWrapper>
    )
}

export { HeroSection }