"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SettingsFormContextType = {
    background_color: string
    background_foreground_color: string
    header_color: string
    header_foreground_color: string
    filter_background_color: string
    filter_text_color: string
    product_card_background_color: string
    product_card_text_color: string
    show_brand_logo: boolean
    show_brand_text: boolean
    header_floating: boolean
    header_size: "SMALL" | "MEDIUM" | "LARGE"
    show_filters: boolean
    show_sorting_filter: boolean
    show_categories_filter: boolean
    show_price_filter: boolean
    show_searchbar_filter: boolean
    setBackgroundColor: (color: string) => void
    setBackgroundForegroundColor: (color: string) => void
    setHeaderColor: (color: string) => void
    setHeaderForegroundColor: (color: string) => void
    setFilterBackgroundColor: (color: string) => void
    setFilterTextColor: (color: string) => void
    setProductCardBackgroundColor: (color: string) => void
    setProductCardTextColor: (color: string) => void
    setShowBrandLogo: (show: boolean) => void
    setShowBrandText: (show: boolean) => void
    setHeaderFloating: (floating: boolean) => void
    setHeaderSize: (size: "SMALL" | "MEDIUM" | "LARGE") => void
    setShowFilters: (show: boolean) => void
    setShowSortingFilter: (show: boolean) => void
    setShowCategoriesFilter: (show: boolean) => void
    setShowPriceFilter: (show: boolean) => void
    setShowSearchbarFilter: (show: boolean) => void
}

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

type SettingsFormProviderProps = {
    children: ReactNode
    initialBackgroundColor?: string
    initialBackgroundForegroundColor?: string
    initialHeaderColor?: string
    initialHeaderForegroundColor?: string
    initialFilterBackgroundColor?: string
    initialFilterTextColor?: string
    initialProductCardBackgroundColor?: string
    initialProductCardTextColor?: string
    initialShowBrandLogo?: boolean
    initialShowBrandText?: boolean
    initialHeaderFloating?: boolean
    initialHeaderSize?: "SMALL" | "MEDIUM" | "LARGE"
    initialShowFilters?: boolean
    initialShowSortingFilter?: boolean
    initialShowCategoriesFilter?: boolean
    initialShowPriceFilter?: boolean
    initialShowSearchbarFilter?: boolean
}

function SettingsFormProvider({ 
    children, 
    initialBackgroundColor,
    initialBackgroundForegroundColor,
    initialHeaderColor,
    initialHeaderForegroundColor,
    initialFilterBackgroundColor,
    initialFilterTextColor,
    initialProductCardBackgroundColor,
    initialProductCardTextColor,
    initialShowBrandLogo,
    initialShowBrandText,
    initialHeaderFloating,
    initialHeaderSize,
    initialShowFilters,
    initialShowSortingFilter,
    initialShowCategoriesFilter,
    initialShowPriceFilter,
    initialShowSearchbarFilter
}: SettingsFormProviderProps) {
    const [background_color, setBackgroundColor] = useState(initialBackgroundColor || "#ffffff")
    const [background_foreground_color, setBackgroundForegroundColor] = useState(initialBackgroundForegroundColor || "#000000")
    const [header_color, setHeaderColor] = useState(initialHeaderColor || "#ffffff")
    const [header_foreground_color, setHeaderForegroundColor] = useState(initialHeaderForegroundColor || "#000000")
    const [filter_background_color, setFilterBackgroundColor] = useState(initialFilterBackgroundColor || "#ffffff")
    const [filter_text_color, setFilterTextColor] = useState(initialFilterTextColor || "#000000")
    const [product_card_background_color, setProductCardBackgroundColor] = useState(initialProductCardBackgroundColor || "#ffffff")
    const [product_card_text_color, setProductCardTextColor] = useState(initialProductCardTextColor || "#000000")
    const [show_brand_logo, setShowBrandLogo] = useState(initialShowBrandLogo ?? true)
    const [show_brand_text, setShowBrandText] = useState(initialShowBrandText ?? true)
    const [header_floating, setHeaderFloating] = useState(initialHeaderFloating ?? false)
    const [header_size, setHeaderSize] = useState<"SMALL" | "MEDIUM" | "LARGE">(initialHeaderSize || "MEDIUM")
    const [show_filters, setShowFilters] = useState(initialShowFilters ?? true)
    const [show_sorting_filter, setShowSortingFilter] = useState(initialShowSortingFilter ?? true)
    const [show_categories_filter, setShowCategoriesFilter] = useState(initialShowCategoriesFilter ?? true)
    const [show_price_filter, setShowPriceFilter] = useState(initialShowPriceFilter ?? true)
    const [show_searchbar_filter, setShowSearchbarFilter] = useState(initialShowSearchbarFilter ?? true)

    const value = {
        background_color,
        background_foreground_color,
        header_color,
        header_foreground_color,
        filter_background_color,
        filter_text_color,
        product_card_background_color,
        product_card_text_color,
        show_brand_logo,
        show_brand_text,
        header_floating,
        header_size,
        show_filters,
        show_sorting_filter,
        show_categories_filter,
        show_price_filter,
        show_searchbar_filter,
        setBackgroundColor,
        setBackgroundForegroundColor,
        setHeaderColor,
        setHeaderForegroundColor,
        setFilterBackgroundColor,
        setFilterTextColor,
        setProductCardBackgroundColor,
        setProductCardTextColor,
        setShowBrandLogo,
        setShowBrandText,
        setHeaderFloating,
        setHeaderSize,
        setShowFilters,
        setShowSortingFilter,
        setShowCategoriesFilter,
        setShowPriceFilter,
        setShowSearchbarFilter
    }

    return (
        <SettingsFormContext.Provider value={value}>
            {children}
        </SettingsFormContext.Provider>
    )
}

function useSettingsForm() {
    const context = useContext(SettingsFormContext)
    if (context === undefined) {
        throw new Error("useSettingsForm must be used within a SettingsFormProvider")
    }
    return context
}

export { SettingsFormProvider, useSettingsForm } 