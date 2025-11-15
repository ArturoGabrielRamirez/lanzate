import { useTranslations } from "next-intl"

import { UserType } from "@/features/account/types"
import { PRICING_PLANS } from "@/features/landing/constants"
import { Offering } from "@/features/shadcn/components/lukacho/pricing-card"
import { Description, OfferingWrapper, Price, PriceCard, ProductName } from "@/features/shadcn/components/lukacho/pricing-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

function MembershipTab({ user }: { user: UserType }) {

    const t = useTranslations("landing.pricing")

    const accountType = user.Account?.[0]?.type

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Membresía
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p>Tipo de plan: {accountType}</p>
                {accountType === 'FREE' && (
                    <div className="container grid items-center gap-4 lg:grid-cols-3 mx-auto relative h-fit w-full font-geist">
                        {PRICING_PLANS.map((plan) => (
                            <PriceCard
                                key={plan.id}
                                contactPageHref={plan.contactPageHref}
                                className={plan.className}
                                actionText={"Upgrade"}
                                disabled={accountType === 'FREE' && plan.id === 'starter'}
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
                )}
            </CardContent>
        </Card>
    )
}

export { MembershipTab }