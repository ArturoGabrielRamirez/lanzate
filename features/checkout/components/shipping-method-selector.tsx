"use client"

import { ShippingMethod } from "@prisma/client"
import { MapPin, Truck } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { ShippingMethodSelectorProps } from "@/features/checkout/types"
import { Button } from "@/features/shadcn/components/ui/button"
import { Label } from "@/features/shadcn/components/ui/label"
import { cn } from "@/lib/utils"

function ShippingMethodSelector({ value, onChange, offersDelivery, deliveryPrice }: ShippingMethodSelectorProps) {
    const { setValue } = useFormContext()
    const t = useTranslations("checkout.delivery.method-selector")

    useEffect(() => {
        setValue("shippingMethod", value)
    }, [value, setValue])

    const handleShippingMethodChange = (e: React.MouseEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLButtonElement
        const type = target.dataset.type
        if (type) {
            const method = type as ShippingMethod
            onChange(method)
            setValue("shippingMethod", method)
        }
    }

    return (
        <div>
            <Label className="text-base font-medium mb-4 block">{t("label")}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleShippingMethodChange}
                    data-type="DELIVERY"
                    disabled={!offersDelivery}
                    className={cn(
                        "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300",
                        value === "DELIVERY"
                            ? "!border-primary !bg-primary !text-primary-foreground !hover:bg-primary/90"
                            : "hover:bg-muted",
                        !offersDelivery && "opacity-50 cursor-not-allowed"
                    )}
                >
                    <Truck className="size-8" />
                    <div className="text-center">
                        <div className="font-semibold">{t("delivery.title")}</div>
                        <div className="text-sm opacity-80">
                            {offersDelivery 
                                ? `${t("delivery.description")} ${deliveryPrice > 0 ? `(+$${deliveryPrice})` : ''}`
                                : t("delivery.not-available")
                            }
                        </div>
                    </div>
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleShippingMethodChange}
                    data-type="PICKUP"
                    className={cn(
                        "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300",
                        value === "PICKUP"
                            ? "!border-primary !bg-primary !text-primary-foreground !hover:bg-primary/90"
                            : "hover:bg-muted"
                    )}
                >
                    <MapPin className="size-8" />
                    <div className="text-center">
                        <div className="font-semibold">{t("pickup.title")}</div>
                        <div className="text-sm opacity-80">
                            {t("pickup.description")}
                        </div>
                    </div>
                </Button>
            </div>
        </div>
    )
} 

export { ShippingMethodSelector }