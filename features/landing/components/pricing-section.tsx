import { Home } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { LandingText } from "@/features/global/components";
import { BackgroundPattern } from "@/features/landing/components"
import { PriceCard, OfferingWrapper, Offering, ProductName, Price, Description } from "@/features/shadcn/components/lukacho/pricing-card"

async function PricingSection() {
    const t = await getTranslations("landing.pricing");

    return (
        <section className="relative pt-17 md:py-17 flex snap-start flex-col items-center font-geist" id="pricing">
            <div className="container grid items-center gap-12 lg:grid-cols-[1fr_3fr] mx-auto px-4 relative h-fit">
                <div className='brightness-90 dark:brightness-100 absolute inset-0'>
                    <BackgroundPattern />
                </div>
                <div className="h-full text-center text-balance md:text-left">
                    <div className="mb-10 flex items-center gap-2 text-primary justify-center md:justify-start">
                        <Home />
                        <h2 className="text-2xl font-bold font-oswald">{t('header.label')}</h2>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl font-oswald">
                        {t('header.title')}
                    </h2>
                    <LandingText>
                        {t('header.description')}
                    </LandingText>
                </div>
                <div className="container grid items-center pt-10 gap-4 lg:grid-cols-3 mx-auto relative h-fit w-full font-geist">
                    <PriceCard contactPageHref="/login" className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 md:scale-90" actionText={t('actions.button')}>
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
                    <PriceCard contactPageHref="/contact" className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 bg-card" actionText={t('actions.button')}>
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
                    <PriceCard contactPageHref="/contact" className="shadow-sm hover:drop-shadow-2xl transition-all hover:-translate-y-1 md:scale-90" actionText={t('actions.button')}>
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
            </div>
        </section>
    )
}

export { PricingSection }