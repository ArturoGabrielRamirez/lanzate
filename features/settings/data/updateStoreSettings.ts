import { actionWrapper } from "@/utils/lib"
import { UpdateSettingsReturn, StoreCustomizationForm } from "@/features/settings/types"
import { PrismaClient } from '@prisma/client'

export async function updateStoreSettings(
    storeId: number, 
    settings: StoreCustomizationForm
): Promise<UpdateSettingsReturn> {
    return actionWrapper(async () => {
        const client = new PrismaClient()

        // Actualizar o crear la configuración
        const customization = await client.storeCustomization.upsert({
            where: {
                store_id: storeId
            },
            update: {
                primary_color: settings.primary_color,
                secondary_color: settings.secondary_color,
                accent_color: settings.accent_color,
                background_color: settings.background_color,
                text_color: settings.text_color,
                secondary_text_color: settings.secondary_text_color,
                border_color: settings.border_color,
                success_color: settings.success_color,
                warning_color: settings.warning_color,
                error_color: settings.error_color,
                primary_font: settings.primary_font,
                secondary_font: settings.secondary_font,
                font_size_base: settings.font_size_base,
                show_header: settings.show_header,
                show_logo: settings.show_logo,
                show_search_bar: settings.show_search_bar,
                show_navigation_menu: settings.show_navigation_menu,
                show_cart_icon: settings.show_cart_icon,
                show_user_account: settings.show_user_account,
                header_position: settings.header_position,
                header_style: settings.header_style,
                show_footer: settings.show_footer,
                footer_text: settings.footer_text,
                show_social_links: settings.show_social_links,
                show_contact_info: settings.show_contact_info,
                show_store_info: settings.show_store_info,
                layout_style: settings.layout_style,
                container_max_width: settings.container_max_width,
                border_radius: settings.border_radius,
                spacing_unit: settings.spacing_unit,
                show_hero_section: settings.show_hero_section,
                show_featured_products: settings.show_featured_products,
                show_categories: settings.show_categories,
                show_testimonials: settings.show_testimonials,
                show_about_section: settings.show_about_section,
                products_per_page: settings.products_per_page,
                product_card_style: settings.product_card_style,
                show_product_rating: settings.show_product_rating,
                show_product_stock: settings.show_product_stock,
                show_add_to_cart_btn: settings.show_add_to_cart_btn,
                meta_title: settings.meta_title,
                meta_description: settings.meta_description,
                google_analytics_id: settings.google_analytics_id,
                facebook_pixel_id: settings.facebook_pixel_id,
                google_tag_manager_id: settings.google_tag_manager_id,
            },
            create: {
                store_id: storeId,
                primary_color: settings.primary_color,
                secondary_color: settings.secondary_color,
                accent_color: settings.accent_color,
                background_color: settings.background_color,
                text_color: settings.text_color,
                secondary_text_color: settings.secondary_text_color,
                border_color: settings.border_color,
                success_color: settings.success_color,
                warning_color: settings.warning_color,
                error_color: settings.error_color,
                primary_font: settings.primary_font,
                secondary_font: settings.secondary_font,
                font_size_base: settings.font_size_base,
                show_header: settings.show_header,
                show_logo: settings.show_logo,
                show_search_bar: settings.show_search_bar,
                show_navigation_menu: settings.show_navigation_menu,
                show_cart_icon: settings.show_cart_icon,
                show_user_account: settings.show_user_account,
                header_position: settings.header_position,
                header_style: settings.header_style,
                show_footer: settings.show_footer,
                footer_text: settings.footer_text,
                show_social_links: settings.show_social_links,
                show_contact_info: settings.show_contact_info,
                show_store_info: settings.show_store_info,
                layout_style: settings.layout_style,
                container_max_width: settings.container_max_width,
                border_radius: settings.border_radius,
                spacing_unit: settings.spacing_unit,
                show_hero_section: settings.show_hero_section,
                show_featured_products: settings.show_featured_products,
                show_categories: settings.show_categories,
                show_testimonials: settings.show_testimonials,
                show_about_section: settings.show_about_section,
                products_per_page: settings.products_per_page,
                product_card_style: settings.product_card_style,
                show_product_rating: settings.show_product_rating,
                show_product_stock: settings.show_product_stock,
                show_add_to_cart_btn: settings.show_add_to_cart_btn,
                meta_title: settings.meta_title,
                meta_description: settings.meta_description,
                google_analytics_id: settings.google_analytics_id,
                facebook_pixel_id: settings.facebook_pixel_id,
                google_tag_manager_id: settings.google_tag_manager_id,
            }
        })

        return {
            message: "Settings updated successfully",
            payload: customization,
            error: false
        }
    })
} 