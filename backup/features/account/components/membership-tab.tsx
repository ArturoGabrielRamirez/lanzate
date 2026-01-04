"use client"
import { CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { cancelSuscriptionAction, getPlanHrefAction } from "@/features/account/actions"
import { UserType } from "@/features/account/types"
import { Button } from "@/features/shadcn/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"

function MembershipTab({ user }: { user: UserType }) {
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
        toast.loading("Cargando...")
        cancelSuscriptionAction(user.Account?.[0]?.suscription_id as string)
            .then((_res) => {
                toast.dismiss()
                toast.success("Suscripción cancelada exitosamente")
            })
            .catch((_err) => {
                toast.dismiss()
                toast.error("Error al cancelar la suscripción")
            })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <CreditCard className="size-5" />
                    Membresía
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Tipo de plan: <span className="font-semibold text-foreground">{accountType}</span></p>
                        <p className="text-sm text-muted-foreground">ID de suscripción: <span className="font-mono text-xs">{user.Account?.[0]?.suscription_id}</span></p>
                        <p className="text-sm text-muted-foreground">Fecha de suscripción: <span className="font-semibold text-foreground">{Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short" }).format(new Date(user.Account?.[0]?.created_at as string))}</span></p>
                    </div>

                    <div className="pt-4 border-t">
                        <h3 className="text-sm font-semibold mb-3">Cambiar plan</h3>
                        <div className="grid gap-3 lg:grid-cols-3">
                            <Button
                                disabled={accountType === 'FREE' || accountType === 'PRO' || accountType === 'ENTERPRISE'}
                                variant="outline"
                                className="w-full"
                            >
                                Starter
                            </Button>
                            <Button
                                data-action="upgrade-plan"
                                disabled={accountType === 'PRO' || accountType === 'ENTERPRISE'}
                                onClick={handleBusinessPlan}
                                variant={accountType === 'FREE' ? 'default' : 'outline'}
                                className="w-full"
                            >
                                Business
                            </Button>
                            <Button
                                disabled={accountType === 'ENTERPRISE'}
                                onClick={handleEnterprisePlan}
                                variant={accountType !== 'ENTERPRISE' ? 'default' : 'outline'}
                                className="w-full"
                            >
                                Enterprise
                            </Button>
                        </div>
                    </div>

                    {accountType !== "FREE" && (
                        <div className="pt-4 border-t">
                            <Button
                                data-action="cancel-subscription"
                                variant="destructive"
                                onClick={handleCancelSubscription}
                                className="w-full"
                            >
                                Cancelar suscripción
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export { MembershipTab }