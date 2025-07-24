import * as yup from 'yup'

export const settingsSchema = yup.object({
    // Configuración de tema y colores
    primary_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    secondary_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    accent_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    background_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    text_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    secondary_text_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    border_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    success_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    warning_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),
    error_color: yup.string().matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color format'),

    // Configuración de fuentes
    primary_font: yup.string(),
    secondary_font: yup.string(),
    font_size_base: yup.string(),

    // Configuración del header
    show_header: yup.boolean(),
    show_logo: yup.boolean(),
    show_search_bar: yup.boolean(),
    show_navigation_menu: yup.boolean(),
    show_cart_icon: yup.boolean(),
    show_user_account: yup.boolean(),
    header_position: yup.string().oneOf(['TOP', 'FIXED_TOP', 'STICKY']),
    header_style: yup.string().oneOf(['MODERN', 'CLASSIC', 'MINIMAL', 'BOLD']),

    // Configuración del footer
    show_footer: yup.boolean(),
    footer_text: yup.string().max(500, 'Footer text must be less than 500 characters'),
    show_social_links: yup.boolean(),
    show_contact_info: yup.boolean(),
    show_store_info: yup.boolean(),

    // Configuración general del layout
    layout_style: yup.string().oneOf(['MODERN', 'CLASSIC', 'MINIMAL', 'GRID', 'MAGAZINE']),
    container_max_width: yup.string(),
    border_radius: yup.string(),
    spacing_unit: yup.string(),

    // Configuración de la página principal
    show_hero_section: yup.boolean(),
    show_featured_products: yup.boolean(),
    show_categories: yup.boolean(),
    show_testimonials: yup.boolean(),
    show_about_section: yup.boolean(),

    // Configuración de productos
    products_per_page: yup.number().min(1, 'Products per page must be at least 1').max(100, 'Products per page must be at most 100'),
    product_card_style: yup.string().oneOf(['MODERN', 'CLASSIC', 'MINIMAL', 'DETAILED', 'COMPACT']),
    show_product_rating: yup.boolean(),
    show_product_stock: yup.boolean(),
    show_add_to_cart_btn: yup.boolean(),

    // SEO y Analytics
    meta_title: yup.string().max(60, 'Meta title must be less than 60 characters'),
    meta_description: yup.string().max(160, 'Meta description must be less than 160 characters'),
    google_analytics_id: yup.string(),
    facebook_pixel_id: yup.string(),
    google_tag_manager_id: yup.string(),
}) 