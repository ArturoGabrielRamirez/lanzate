import { StoreCustomization } from "@prisma/client"

export type StoreCustomizationForm = {
    // Configuración de tema y colores
    primary_color: string
    secondary_color: string
    accent_color: string
    background_color: string
    text_color: string
    secondary_text_color: string
    border_color: string
    success_color: string
    warning_color: string
    error_color: string

    // Configuración de fuentes
    primary_font: string
    secondary_font: string
    font_size_base: string

    // Configuración del header
    show_header: boolean
    show_logo: boolean
    show_search_bar: boolean
    show_navigation_menu: boolean
    show_cart_icon: boolean
    show_user_account: boolean
    header_position: 'TOP' | 'FIXED_TOP' | 'STICKY'
    header_style: 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'BOLD'

    // Configuración del footer
    show_footer: boolean
    footer_text: string
    show_social_links: boolean
    show_contact_info: boolean
    show_store_info: boolean

    // Configuración general del layout
    layout_style: 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'GRID' | 'MAGAZINE'
    container_max_width: string
    border_radius: string
    spacing_unit: string

    // Configuración de la página principal
    show_hero_section: boolean
    show_featured_products: boolean
    show_categories: boolean
    show_testimonials: boolean
    show_about_section: boolean

    // Configuración de productos
    products_per_page: number
    product_card_style: 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'DETAILED' | 'COMPACT'
    show_product_rating: boolean
    show_product_stock: boolean
    show_add_to_cart_btn: boolean

    // SEO y Analytics
    meta_title: string
    meta_description: string
    google_analytics_id: string
    facebook_pixel_id: string
    google_tag_manager_id: string
}

export type UpdateSettingsReturn = {
    message: string
    payload: any
    error: boolean
}

export type GetSettingsReturn = {
    message: string
    payload: StoreCustomization & {
        store: {
            subdomain: string
        }
    }
    error: boolean
} 