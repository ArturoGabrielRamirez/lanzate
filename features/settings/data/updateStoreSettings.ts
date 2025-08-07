import { actionWrapper } from "@/utils/lib"
import { StoreCustomization } from "@prisma/client"
/* import { PrismaClient } from '@prisma/client' */
import { prisma } from "@/utils/prisma"
import { ResponseType } from "@/features/layout/types"

export async function updateStoreSettings(
    storeId: number,
    settings: StoreCustomization
): Promise<ResponseType<StoreCustomization>> {
    console.log("🚀 ~ updateStoreSettings ~ settings:", settings)
    return actionWrapper(async () => {

        const customization = await prisma.storeCustomization.upsert({
            where: {
                store_id: storeId
            },
            update: {
                background_foreground_color: settings.background_foreground_color,
                background_color: settings.background_color,
                header_color: settings.header_color,
                header_foreground_color: settings.header_foreground_color,
                filter_background_color: settings.filter_background_color,
                filter_text_color: settings.filter_text_color,
                product_card_background_color: settings.product_card_background_color,
                product_card_text_color: settings.product_card_text_color,
                show_brand_text: settings.show_brand_text,
                show_brand_logo: settings.show_brand_logo,
                header_floating: settings.header_floating,
                header_size: settings.header_size,
                show_filters: settings.show_filters,
                show_sorting_filter: settings.show_sorting_filter,
                show_categories_filter: settings.show_categories_filter,
                show_price_filter: settings.show_price_filter,
                show_searchbar_filter: settings.show_searchbar_filter,
                show_main_searchbar: settings.show_main_searchbar,
                
            },
            create: {
                store_id: storeId,
                background_foreground_color: settings.background_foreground_color,
                background_color: settings.background_color,
                header_color: settings.header_color,
                header_foreground_color: settings.header_foreground_color,
                filter_background_color: settings.filter_background_color,
                filter_text_color: settings.filter_text_color,
                product_card_background_color: settings.product_card_background_color,
                product_card_text_color: settings.product_card_text_color,
                show_brand_text: settings.show_brand_text,
                show_brand_logo: settings.show_brand_logo,
                header_floating: settings.header_floating,
                header_size: settings.header_size,
                show_filters: settings.show_filters,
                show_sorting_filter: settings.show_sorting_filter,
                show_categories_filter: settings.show_categories_filter,
                show_price_filter: settings.show_price_filter,
                show_searchbar_filter: settings.show_searchbar_filter,
                show_main_searchbar: settings.show_main_searchbar,
            }
        })

        return {
            message: "Settings updated successfully",
            payload: customization,
            error: false
        }
    })
} 