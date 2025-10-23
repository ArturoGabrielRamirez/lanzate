"use client"

import { DollarSign, Package } from "lucide-react"

import { InputField } from "@/features/layout/components"
import type { PriceStockSectionProps } from "@/features/products/types"

function PriceStockSection({ defaults }: PriceStockSectionProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
                name="price"
                label={"Precio"}
                type="number"
                defaultValue={defaults?.price != null ? String(defaults.price) : "0"}
                startContent={<DollarSign />}
            />
            <InputField
                name="stock"
                label={"Stock"}
                type="number"
                defaultValue={defaults?.stock != null ? String(defaults.stock) : "0"}
                startContent={<Package />}
            />
        </div>
    )
}

export { PriceStockSection }


