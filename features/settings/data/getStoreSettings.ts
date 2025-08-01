/* import { PrismaClient } from '@prisma/client' */
import { actionWrapper } from "@/utils/lib"
import { GetSettingsReturn } from "@/features/settings/types"
import { prisma } from "@/utils/prisma"

export async function getStoreSettings(storeId: number): Promise<GetSettingsReturn> {
    return actionWrapper(async () => {
        /* const client = new PrismaClient() */

        let customization = await prisma.storeCustomization.findUnique({
            where: {
                store_id: storeId
            }
        })

        // Si no existe, crear una con valores por defecto
        if (!customization) {
            customization = await prisma.storeCustomization.create({
                data: {
                    store_id: storeId,
                    // Los valores por defecto ya están definidos en el schema de Prisma
                }
            })
        }

        return {
            message: "Settings retrieved successfully",
            payload: {
                primary_color: customization.primary_color,
                secondary_color: customization.secondary_color,
                accent_color: customization.accent_color,
                background_color: customization.background_color,
                text_color: customization.text_color,
                secondary_text_color: customization.secondary_text_color,
                border_color: customization.border_color,
                success_color: customization.success_color,
                warning_color: customization.warning_color,
                error_color: customization.error_color,
                primary_font: customization.primary_font,
                secondary_font: customization.secondary_font,
                font_size_base: customization.font_size_base,
                show_header: customization.show_header,
                show_logo: customization.show_logo,
                show_search_bar: customization.show_search_bar,
                show_navigation_menu: customization.show_navigation_menu,
                show_cart_icon: customization.show_cart_icon,
                show_user_account: customization.show_user_account,
                header_position: customization.header_position as 'TOP' | 'FIXED_TOP' | 'STICKY',
                header_style: customization.header_style as 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'BOLD',
                show_footer: customization.show_footer,
                footer_text: customization.footer_text || '',
                show_social_links: customization.show_social_links,
                show_contact_info: customization.show_contact_info,
                show_store_info: customization.show_store_info,
                layout_style: customization.layout_style as 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'GRID' | 'MAGAZINE',
                container_max_width: customization.container_max_width,
                border_radius: customization.border_radius,
                spacing_unit: customization.spacing_unit,
                show_hero_section: customization.show_hero_section,
                show_featured_products: customization.show_featured_products,
                show_categories: customization.show_categories,
                show_testimonials: customization.show_testimonials,
                show_about_section: customization.show_about_section,
                products_per_page: customization.products_per_page,
                product_card_style: customization.product_card_style as 'MODERN' | 'CLASSIC' | 'MINIMAL' | 'DETAILED' | 'COMPACT',
                show_product_rating: customization.show_product_rating,
                show_product_stock: customization.show_product_stock,
                show_add_to_cart_btn: customization.show_add_to_cart_btn,
                meta_title: customization.meta_title || '',
                meta_description: customization.meta_description || '',
                google_analytics_id: customization.google_analytics_id || '',
                facebook_pixel_id: customization.facebook_pixel_id || '',
                google_tag_manager_id: customization.google_tag_manager_id || '',
            },
            error: false
        }
    })
} 