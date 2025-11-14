import { Home } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { ROUTES } from "@/features/global/constants";
import { LandingSectionWrapper, SectionHeader } from "@/features/landing/components"
import { PriceCard, OfferingWrapper, Offering, ProductName, Price, Description } from "@/features/shadcn/components/lukacho/pricing-card"

async function PricingSection() {
    const t = await getTranslations("landing.pricing");

    return (
        <LandingSectionWrapper
            id="pricing"
            className="flex-col items-center font-geist"
            containerClassName="grid items-center gap-12 lg:grid-cols-[1fr_3fr] h-fit"
            contentClassName="col-span-2 md:grid md:grid-cols-[1fr_3fr]"
        >
            <SectionHeader
                icon={<Home />}
                labelKey="header.label"
                titleKey="header.title"
                descriptionKey="header.description"
                namespace="landing.pricing"
                titleClassName="mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald"
                containerClassName="h-full text-center text-balance md:text-left"
            />
            <div className="container grid items-center gap-4 lg:grid-cols-3 mx-auto relative h-fit w-full font-geist">
                <PriceCard contactPageHref={ROUTES.LOGIN} className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 md:scale-90" actionText={t('actions.button')}>
                    <ProductName>{t('plans.starter.name')}</ProductName>
                    <Price>{t('plans.starter.price')}</Price>
                    <Description>
                        {t('plans.starter.description')}
                    </Description>
                    <OfferingWrapper>
                        <Offering>{t('plans.starter.features.feature1')}</Offering>
                        <Offering>{t('plans.starter.features.feature2')}</Offering>
                        <Offering>{t('plans.starter.features.feature3')}</Offering>
                        <Offering>{t('plans.starter.features.feature4')}</Offering>
                        <Offering>{t('plans.starter.features.feature5')}</Offering>
                        <Offering>{t('plans.starter.features.feature6')}</Offering>
                    </OfferingWrapper>
                </PriceCard>
                <PriceCard contactPageHref={ROUTES.WAITLIST} className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 bg-card" actionText={t('actions.button')}>
                    <ProductName>{t('plans.business.name')}</ProductName>
                    <Price>{t('plans.business.price')}</Price>
                    <Description>
                        {t('plans.business.description')}
                    </Description>
                    <OfferingWrapper>
                        <Offering>{t('plans.business.features.feature1')}</Offering>
                        <Offering>{t('plans.business.features.feature2')}</Offering>
                        <Offering>{t('plans.business.features.feature3')}</Offering>
                        <Offering>{t('plans.business.features.feature4')}</Offering>
                        <Offering>{t('plans.business.features.feature5')}</Offering>
                    </OfferingWrapper>
                </PriceCard>
                <PriceCard contactPageHref={ROUTES.WAITLIST} className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 md:scale-90" actionText={t('actions.button')}>
                    <ProductName>{t('plans.enterprise.name')}</ProductName>
                    <Price>{t('plans.enterprise.price')}</Price>
                    <Description>
                        {t('plans.enterprise.description')}
                    </Description>
                    <OfferingWrapper>
                        <Offering>{t('plans.enterprise.features.feature1')}</Offering>
                        <Offering>{t('plans.enterprise.features.feature2')}</Offering>
                        <Offering>{t('plans.enterprise.features.feature3')}</Offering>
                        <Offering>{t('plans.enterprise.features.feature4')}</Offering>
                        <Offering>{t('plans.enterprise.features.feature5')}</Offering>
                        <Offering>{t('plans.enterprise.features.feature6')}</Offering>
                    </OfferingWrapper>
                </PriceCard>
            </div>
        </LandingSectionWrapper>
    )
}

export { PricingSection }