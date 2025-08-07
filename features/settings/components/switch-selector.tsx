"use client"

import { Switch } from "@/components/ui/switch"
import { useFormContext } from "react-hook-form"
import { useSettingsForm } from "./settings-form-provider"
import { useState, useEffect } from "react"

type SwitchSelectorProps = {
    label: string
    defaultChecked?: boolean
    className?: string
    targetField?: "show_brand_logo" | "show_brand_text"
}

function SwitchSelector({
    label,
    defaultChecked = false,
    className,
    targetField = "show_brand_logo"
}: SwitchSelectorProps) {
    const { setValue } = useFormContext()
    const { 
        show_brand_logo,
        show_brand_text,
        setShowBrandLogo,
        setShowBrandText
    } = useSettingsForm()
    
    // Initialize with the appropriate value based on target field
    const getInitialValue = () => {
        switch (targetField) {
            case "show_brand_logo":
                return show_brand_logo
            case "show_brand_text":
                return show_brand_text
            default:
                return defaultChecked
        }
    }
    
    const [isChecked, setIsChecked] = useState<boolean>(getInitialValue())

    // Update switch state when context values change
    useEffect(() => {
        if (targetField === "show_brand_logo") {
            setIsChecked(show_brand_logo)
        } else if (targetField === "show_brand_text") {
            setIsChecked(show_brand_text)
        }
    }, [show_brand_logo, show_brand_text, targetField])

    const handleSwitchChange = (checked: boolean) => {
        setIsChecked(checked)
        setValue(targetField, checked)
        
        // Update the appropriate context based on target field
        switch (targetField) {
            case "show_brand_logo":
                setShowBrandLogo(checked)
                break
            case "show_brand_text":
                setShowBrandText(checked)
                break
        }
    }

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <label className="text-sm text-muted-foreground">
                {label}
            </label>
            <Switch
                checked={isChecked}
                onCheckedChange={handleSwitchChange}
            />
        </div>
    )
}

export default SwitchSelector 