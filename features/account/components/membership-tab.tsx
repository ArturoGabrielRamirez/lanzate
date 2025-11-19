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
        toast.loading("Cargando...")
        getPlanHrefAction("business", "test_user_3019206675162437910@testuser.com", user.email)
            .then((res) => {
                toast.dismiss()
                toast.success("Plan obtenido exitosamente")
                router.push(res.payload!)
            })
            .catch((_err) => {
                toast.dismiss()
                toast.error("Error al obtener el plan")
            })
    }

    const handleEnterprisePlan = async () => {
        getPlanHrefAction("enterprise", "test_user_3019206675162437910@testuser.com", user.email)
            .then((res) => {
                console.log("🚀 ~ handleEnterprisePlan ~ res:", res)
                toast.dismiss()
                toast.success("Plan obtenido exitosamente")
                router.push(res.payload!)
            })
            .catch((_err) => {
                toast.dismiss()
                toast.error("Error al obtener el plan")
            })
    }

    const handleCancelSubscription = () => {
        console.log("Cancelar suscripción")
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
                <div className="container grid items-center gap-4 lg:grid-cols-3 mx-auto relative h-fit w-full font-geist mb-4">
                    <Button disabled={accountType === 'FREE' || accountType === 'PRO' || accountType === 'ENTERPRISE'}>Starter</Button>
                    <Button disabled={accountType === 'PRO' || accountType === 'ENTERPRISE'} onClick={handleBusinessPlan}>Business</Button>
                    <Button disabled={accountType === 'ENTERPRISE'} onClick={handleEnterprisePlan}>Enterprise</Button>
                </div>
                {accountType !== "FREE" && (
                    <Button variant="destructive" onClick={handleCancelSubscription}>
                        Cancelar suscripción
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

export { MembershipTab }