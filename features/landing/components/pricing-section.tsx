import { Home } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { LandingSectionWrapper, SectionHeader } from "@/features/landing/components"
import { PRICING_PLANS } from "@/features/landing/constants"
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
                {PRICING_PLANS.map((plan) => (
                    <PriceCard 
                        key={plan.id} 
                        contactPageHref={plan.contactPageHref} 
                        className={plan.className} 
                        actionText={t('actions.button')}
                    >
                        <ProductName>{t(`plans.${plan.planKey}.name`)}</ProductName>
                        <Price>{t(`plans.${plan.planKey}.price`)}</Price>
                        <Description>
                            {t(`plans.${plan.planKey}.description`)}
                        </Description>
                        <OfferingWrapper>
                            {Array.from({ length: plan.featuresCount }, (_, i) => (
                                <Offering key={i + 1}>
                                    {t(`plans.${plan.planKey}.features.feature${i + 1}`)}
                                </Offering>
                            ))}
                        </OfferingWrapper>
                    </PriceCard>
                ))}
            </div>
        </LandingSectionWrapper>
    )
}

export { PricingSection }