"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "./cart-provider"
import { useTranslations } from "next-intl"

function CartResume() {

    const t = useTranslations("cart.resume")

    const { quantity, total } = useCart()

    return (
        <Card className="flex-1 max-w-sm xl:max-w-md bg-accent text-accent-foreground w-full grow">
            <CardHeader>
                <CardTitle className="text-lg font-bold">{t("resume.title")}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">{t("quantity")}: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span className="w-max text-sm">{quantity} {quantity > 1 ? t("items") : t("item")}</span>
                    </p>
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">{t("sub-total")}: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}</span>
                    </p>
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">{t("shipping")}: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span>{Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(0)}</span>
                    </p>
                    <p className="grid grid-cols-[max-content_1fr_min-content] gap-2">
                        <span className="w-max text-sm text-muted-foreground">{t("discount")}: </span>
                        <span className="border-dotted w-full border-2 border-t-0 border-r-0 border-l-0 relative bottom-2"></span>
                        <span>{Intl.NumberFormat("es-AR", { style: "percent", currency: "ARS" }).format(0)}</span>
                    </p>
                </div>
                <div className="bg-primary h-px w-full my-4"></div>
                <p className="font-bold text-lg text-right">
                    {t("total")}: {Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(total)}
                </p>
            </CardContent>
        </Card>
    )
}
export default CartResume