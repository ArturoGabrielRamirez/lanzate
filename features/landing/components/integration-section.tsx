import { Plug } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { LandingText } from "@/features/global/components";
import { LandingSectionWrapper, SectionHeader } from "@/features/landing/components"
import { INTEGRATION_PARTNERS } from "@/features/landing/constants";
import { MarqueeLogoScroller } from "@/features/shadcn/components/marquee-logo"

async function IntegrationSection() {

    const t = await getTranslations("landing.integrations");

    return (
        <LandingSectionWrapper
            id="integrations"
            className="flex-col items-center"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8 items-end mb-10 text-center text-balance md:text-left">
                <SectionHeader
                    icon={<Plug />}
                    labelKey="header.label"
                    titleKey="header.title"
                    namespace="landing.integrations"
                />
                <LandingText>
                    {t('header.description')}
                </LandingText>
            </div>
                <MarqueeLogoScroller
                    title={t('marquee.title')}
                    description={t('marquee.description')}
                    logos={INTEGRATION_PARTNERS}
                    speed="normal"
                />
        </LandingSectionWrapper>
    )
}

export { IntegrationSection }