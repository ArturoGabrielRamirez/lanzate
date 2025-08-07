"use client"

import { useSettingsForm } from "./settings-form-provider"

type StorePreviewProps = {
    children: React.ReactNode
}

function StorePreview({ children }: StorePreviewProps) {
    const { 
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
        show_searchbar_filter
    } = useSettingsForm()

    return (
        <div
            style={{
                "--background": background_color,
                "--foreground": background_foreground_color,
                "--header": header_color,
                "--header-foreground": header_foreground_color,
                "--filter-background": filter_background_color,
                "--filter-text": filter_text_color,
                "--product-card-background": product_card_background_color,
                "--product-card-text": product_card_text_color,
                "--show-brand-logo": show_brand_logo ? "block" : "none",
                "--show-brand-text": show_brand_text ? "block" : "none",
                "--header-floating": header_floating ? "absolute" : "static",
                "--header-size": header_size == "LARGE" ? "100%" : header_size == "MEDIUM" ? "80%" : "50%",
                "--section-padding-top": header_floating ? "88px" : "0px",
                "--header-top": header_floating ? "16px" : "0px",
                "--header-padding-top": header_floating ? "8px" : "16px",
                "--header-padding-bottom": header_floating ? "8px" : "16px",
                "--header-padding-left": header_floating ? "24px" : "16px",
                "--header-padding-right": header_floating ? "24px" : "16px",
                "--header-border-radius": header_size !== "LARGE" ? "16px" : "0px",
                "--show-filters": show_filters ? "flex" : "none",
                "--show-sorting-filter": show_sorting_filter ? "block" : "none",
                "--show-categories-filter": show_categories_filter ? "block" : "none",
                "--show-price-filter": show_price_filter ? "block" : "none",
                "--show-searchbar-filter": show_searchbar_filter ? "block" : "none",
            } as React.CSSProperties}
            className="bg-background rounded-lg overflow-hidden relative"
        >
            {children}
        </div>
    )
}

export default StorePreview