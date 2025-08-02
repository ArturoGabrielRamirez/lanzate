"use client"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { MapPin, Truck } from "lucide-react"
import { useFormContext } from "react-hook-form"

type ShippingMethod = "delivery" | "pickup"

interface ShippingMethodSelectorProps {
    value: ShippingMethod
    onChange: (method: ShippingMethod) => void
}

export function ShippingMethodSelector({ value, onChange }: ShippingMethodSelectorProps) {
    const { setValue } = useFormContext()

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
            <Label className="text-base font-medium mb-4 block">Choose your delivery method</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleShippingMethodChange} 
                    data-type="delivery"
                    className={cn(
                        "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300",
                        value === "delivery" 
                            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "hover:bg-muted"
                    )}
                >
                    <Truck className="size-8" />
                    <div className="text-center">
                        <div className="font-semibold">Delivery</div>
                        <div className="text-sm opacity-80">
                            Orders take 30 min to 2 hours
                        </div>
                    </div>
                </Button>
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={handleShippingMethodChange} 
                    data-type="pickup"
                    className={cn(
                        "h-auto p-4 flex flex-col items-center gap-2 transition-all duration-300",
                        value === "pickup" 
                            ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90" 
                            : "hover:bg-muted"
                    )}
                >
                    <MapPin className="size-8" />
                    <div className="text-center">
                        <div className="font-semibold">Pickup</div>
                        <div className="text-sm opacity-80">
                            Orders take 5-10 minutes
                        </div>
                    </div>
                </Button>
            </div>
        </div>
    )
} 