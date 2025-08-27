"use client"

import { DollarSign, Package } from "lucide-react"
import { InputField } from "@/features/layout/components"

export function PriceStockSection() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
                name="price"
                label={"Precio"}
                type="number"
                defaultValue="0"
                startContent={<DollarSign />}
            />
            <InputField
                name="stock"
                label={"Stock"}
                type="number"
                defaultValue="0"
                startContent={<Package />}
            />
        </div>
    )
}

export default PriceStockSection


