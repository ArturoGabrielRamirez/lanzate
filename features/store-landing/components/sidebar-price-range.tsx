"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useQueryState } from "nuqs"
import { useState } from "react"

function SidebarPriceRange() {

    const [min, setMin] = useState(0)
    const [max, setMax] = useState(0)
    const [minValue, setMinValue] = useQueryState("min", { shallow: false, clearOnDefault: true })
    const [maxValue, setMaxValue] = useQueryState("max", { shallow: false, clearOnDefault: true })

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMin(Number(e.target.value))
    }

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMax(Number(e.target.value))
    }

    const handleSearch = () => {
        if (min === 0) {
            setMinValue(null)
        }
        if (max === 0) {
            setMaxValue(null)
        }
        if (min > 0) {
            setMinValue(min.toString())
        }
        if (max > 0) {
            setMaxValue(max.toString())
        }
    }

    return (
        <div className="flex gap-2">
            <Input placeholder="Min $" onChange={handleMinChange} />
            -
            <Input placeholder="Max $" onChange={handleMaxChange} />
            <Button variant="outline" onClick={handleSearch}>
                <Search />
            </Button>
        </div>
    )
}

export default SidebarPriceRange
