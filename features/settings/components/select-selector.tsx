"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/features/shadcn/components/ui/select"
import { useFormContext } from "react-hook-form"
import { useSettingsForm } from "./settings-form-provider"
import { useState, useEffect } from "react"

type SelectSelectorProps = {
    label: string
    defaultValue?: string
    className?: string
    targetField?: "header_size"
    options: { value: string; label: string }[]
}

function SelectSelector({
    label,
    defaultValue = "",
    className,
    targetField = "header_size",
    options
}: SelectSelectorProps) {
    const { setValue } = useFormContext()
    const { 
        header_size,
        setHeaderSize
    } = useSettingsForm()
    
    // Initialize with the appropriate value based on target field
    const getInitialValue = () => {
        switch (targetField) {
            case "header_size":
                return header_size
            default:
                return defaultValue
        }
    }
    
    const [selectedValue, setSelectedValue] = useState<string>(getInitialValue())

    // Update select state when context values change
    useEffect(() => {
        if (targetField === "header_size") {
            setSelectedValue(header_size)
        }
    }, [header_size, targetField])

    const handleSelectChange = (value: string) => {
        setSelectedValue(value)
        setValue(targetField, value)
        
        // Update the appropriate context based on target field
        switch (targetField) {
            case "header_size":
                setHeaderSize(value as "SMALL" | "MEDIUM" | "LARGE")
                break
        }
    }

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <label className="text-sm text-muted-foreground">
                {label}
            </label>
            <Select value={selectedValue} onValueChange={handleSelectChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Seleccionar opción" />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default SelectSelector 