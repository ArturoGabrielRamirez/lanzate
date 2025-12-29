"use client"

/* import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"
import { Checkbox } from "@/features/shadcn/components/ui/checkbox" */
import { Label } from "@/features/shadcn/components/ui/label"

export function SettingsProductPanel() {
    
/*     const { setValue } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext() */
    
 /*    useEffect(() => {
        // Ensure default values are set
        setStepValid(4, true)
    }, []) */

    /* const handleCheckChange = useCallback((field: keyof CreateProductFormType['settings_info']) => (checked: boolean) => {
        setValues({ settings_info: { ...values.settings_info, [field]: checked } })
        setValue(`settings_info.${field}`, checked, { shouldValidate: true })
    }, [setValues, setValue, values]) */

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-2">
                {/* <Checkbox 
                    id="is_active" 
                    checked={values.settings_info.is_active} 
                    onCheckedChange={handleCheckChange("is_active")}
                /> */}
                <Label htmlFor="is_active">Activo</Label>
            </div>

            <div className="flex items-center space-x-2">
                {/* <Checkbox 
                    id="is_featured" 
                    checked={values.settings_info.is_featured} 
                    onCheckedChange={handleCheckChange("is_featured")}
                /> */}
                <Label htmlFor="is_featured">Destacado</Label>
            </div>

            <div className="flex items-center space-x-2">
                {/* <Checkbox 
                    id="is_published" 
                    checked={values.settings_info.is_published} 
                    onCheckedChange={handleCheckChange("is_published")}
                /> */}
                <Label htmlFor="is_published">Publicado</Label>
            </div>
        </div>
    )
}

