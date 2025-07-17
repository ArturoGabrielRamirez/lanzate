"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "./store-provider"
import { useQueryState, parseAsInteger } from "nuqs"

function ProductAmountDisplay({ amount }: { amount: number }) {
    const { } = useStore()
    const [limit, setLimit] = useQueryState("limit", { shallow: false, clearOnDefault: true })

    const handleLimitChange = (value: string) => {
        setLimit(value)
    }

    return (
        <Select value={limit?.toString() || "10"} onValueChange={handleLimitChange}>
            <div className="flex items-center gap-2">
                <span>Showing</span>
                <SelectTrigger>
                    <SelectValue placeholder="10" />
                </SelectTrigger>
                <span>of {amount} products</span>
            </div>
            <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
            </SelectContent>
        </Select>
    )
}

export default ProductAmountDisplay
