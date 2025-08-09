"use client"

import { Switch } from "@/components/ui/switch"
import { useFormContext } from "react-hook-form"
import { useSettingsForm } from "./settings-form-provider"
import { useState, useEffect } from "react"

type SwitchSelectorProps = {
    label: string
    defaultChecked?: boolean
    className?: string
    targetField?: "show_brand_logo" | "show_brand_text" | "header_floating" | "show_filters" | "show_sorting_filter" | "show_categories_filter" | "show_price_filter" | "show_searchbar_filter"
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
        header_floating,
        show_filters,
        show_sorting_filter,
        show_categories_filter,
        show_price_filter,
        show_searchbar_filter,
        setShowBrandLogo,
        setShowBrandText,
        setHeaderFloating,
        setShowFilters,
        setShowSortingFilter,
        setShowCategoriesFilter,
        setShowPriceFilter,
        setShowSearchbarFilter
    } = useSettingsForm()
    
    // Initialize with the appropriate value based on target field
    const getInitialValue = () => {
        switch (targetField) {
            case "show_brand_logo":
                return show_brand_logo
            case "show_brand_text":
                return show_brand_text
            case "header_floating":
                return header_floating
            case "show_filters":
                return show_filters
            case "show_sorting_filter":
                return show_sorting_filter
            case "show_categories_filter":
                return show_categories_filter
            case "show_price_filter":
                return show_price_filter
            case "show_searchbar_filter":
                return show_searchbar_filter
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
        } else if (targetField === "header_floating") {
            setIsChecked(header_floating)
        } else if (targetField === "show_filters") {
            setIsChecked(show_filters)
        } else if (targetField === "show_sorting_filter") {
            setIsChecked(show_sorting_filter)
        } else if (targetField === "show_categories_filter") {
            setIsChecked(show_categories_filter)
        } else if (targetField === "show_price_filter") {
            setIsChecked(show_price_filter)
        } else if (targetField === "show_searchbar_filter") {
            setIsChecked(show_searchbar_filter)
        }
    }, [show_brand_logo, show_brand_text, header_floating, show_filters, show_sorting_filter, show_categories_filter, show_price_filter, show_searchbar_filter, targetField])

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
            case "header_floating":
                setHeaderFloating(checked)
                break
            case "show_filters":
                setShowFilters(checked)
                break
            case "show_sorting_filter":
                setShowSortingFilter(checked)
                break
            case "show_categories_filter":
                setShowCategoriesFilter(checked)
                break
            case "show_price_filter":
                setShowPriceFilter(checked)
                break
            case "show_searchbar_filter":
                setShowSearchbarFilter(checked)
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