import { Info } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

import aboutImage from '@/features/auth/assets/Good team-pana.svg'
import { LandingSectionIconTitle, LandingText } from "@/features/global/components";
import { BackgroundPattern, SectionSubtitle } from "@/features/landing/components";


export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("about.page")
    return {
        title: t('header.title'),
    }
}

export default async function AboutPage() {

    const t = await getTranslations("about.page")

    return (
        <section className="md:min-h-dvh relative pt-17 flex flex-col gap-10">
            <div className='brightness-95 dark:brightness-60 absolute inset-0'>
                <BackgroundPattern />
            </div>
            <div className="container mx-auto px-4 flex flex-col md:grid md:grid-cols-2 md:gap-0 xl:gap-20 2xl:gap-22 xl:[row-gap:0] justify-center items-center md:pb-12 lg:pb-20 z-20 relative grow text-center md:text-left">
                <div>
                    <LandingSectionIconTitle icon={<Info />}>
                        {t('header.title')}
                    </LandingSectionIconTitle>
                    <SectionSubtitle className="mb-8">
                        {t('header.description')}
                    </SectionSubtitle>
                    <div className="space-y-4">
                        <LandingText>
                            {t('description.paragraph1')}
                        </LandingText>
                        <LandingText>
                            {t('description.paragraph2')}
                        </LandingText>
                        <LandingText>
                            {t('description.paragraph3')}
                        </LandingText>
                    </div>
                </div>
                <div className="relative aspect-square w-full hidden md:flex items-end max-w-xl justify-self-center">
                    <Image
                        src={aboutImage}
                        alt="About Us"
                        className="w-full antialiased object-bottom drop-shadow-xl drop-shadow/20"
                    />
                </div>
            </div>
        </section>
    )
}