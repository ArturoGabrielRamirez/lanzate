"use client"

import { useState } from "react"
import { Button } from "@/features/shadcn/components/ui/button"
import { Save } from "lucide-react"
import { useSettingsForm } from "./settings-form-provider"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { updateStoreSettingsAction } from "@/features/settings/actions/updateStoreSettingsAction"
import { StoreCustomization } from "@prisma/client"

type SaveSettingsButtonProps = {
    slug: string
}

function SaveSettingsButton({ slug }: SaveSettingsButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
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
    const { getValues } = useFormContext()

    const handleSave = async () => {
        setIsLoading(true)
        
        try {
            // Get all form values and merge with context values
            const formValues = getValues()
            const settingsData: Partial<StoreCustomization> = {
                ...formValues,
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
            }

            const result = await updateStoreSettingsAction(slug, settingsData as StoreCustomization)
            
            if (result.error) {
                toast.error(result.message)
            } else {
                toast.success(result.message)
            }
        } catch (error) {
            console.error("Error saving settings:", error)
            toast.error("An error occurred while saving settings")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="flex items-center gap-2"
        >
            <Save className="size-4" />
            {isLoading ? "Guardando..." : "Guardar cambios"}
        </Button>
    )
}

export default SaveSettingsButton 