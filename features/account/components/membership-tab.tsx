"use client"
/* import { useTranslations } from "next-intl" */
/* import { redirect } from "next/navigation" */
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { getPlanHrefAction } from "@/features/account/actions"
import { UserType } from "@/features/account/types"
import { Button } from "@/features/shadcn/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

function MembershipTab({ user }: { user: UserType }) {

    /* const t = useTranslations("landing.pricing") */
    const router = useRouter()

    const accountType = user.Account?.[0]?.type

    const handleBusinessPlan = () => {
        console.log("Business plan")
        toast.loading("Cargando...")
        getPlanHrefAction("business", "test_user_3019206675162437910@testuser.com", user.email)
            .then((res) => {
                console.log("🚀 ~ handleBusinessPlan ~ res:", res)
                toast.dismiss()
                toast.success("Plan obtenido exitosamente")
                router.push(res.payload!)
            })
            .catch((err) => {
                toast.dismiss()
                toast.error("Error al obtener el plan")
                console.log("🚀 ~ handleBusinessPlan ~ err:", err)
            })
    }

    const handleEnterprisePlan = async () => {
        console.log("Enterprise plan")
        getPlanHrefAction("enterprise", "test_user_3019206675162437910@testuser.com", user.email)
            .then((res) => {
                console.log("🚀 ~ handleEnterprisePlan ~ res:", res)
                toast.dismiss()
                toast.success("Plan obtenido exitosamente")
                router.push(res.payload!)
            })
            .catch((err) => {
                toast.dismiss()
                toast.error("Error al obtener el plan")
                console.log("🚀 ~ handleEnterprisePlan ~ err:", err)
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Membresía
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="mb-4">Tipo de plan: {accountType}</p>
                {accountType === 'FREE' && (
                    <div className="container grid items-center gap-4 lg:grid-cols-3 mx-auto relative h-fit w-full font-geist">
                        <Button>Starter</Button>
                        <Button onClick={handleBusinessPlan}>Business</Button>
                        <Button onClick={handleEnterprisePlan}>Enterprise</Button>
                        {/* {PRICING_PLANS.map((plan) => (
                            <PriceCard
                                key={plan.id}
                                contactPageHref={plan.contactPageHref}
                                className={`${plan.className} ${accountType === 'FREE' && plan.id === 'starter' ? "opacity-50" : ""} bg-accent hover:bg-accent/50`}
                                actionText={accountType === 'FREE' && plan.id === 'starter' ? "Current Plan" : "Upgrade"}
                                disabled={accountType === 'FREE' && plan.id === 'starter' ? true : false}
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
                        ))} */}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export { MembershipTab }