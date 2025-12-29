"use client"

import { useCallback, useEffect } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType } from "@/features/products/schemas/create-product-form-schema"

export function MediaProductPanel() {
    
    const { setValue, formState: { isValid, disabled } } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext()
    
    useEffect(() => {
        // trigger validation if needed
        setStepValid(2, true) // Assuming optional or valid by default
    }, [])

    useEffect(() => {
        setStepValid(2, isValid)
    }, [isValid, setStepValid])

    const handleVideoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setValues({ media_info: { ...values.media_info, video_url: val } })
        setValue("media_info.video_url", val, { shouldValidate: true })
    }, [setValues, setValue, values])

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Aquí podrías integrar un componente de subida de archivos (dropzone). 
                Por ahora, solo campo de video URL como ejemplo.
            </p>
            
            <InputField
                name="media_info.video_url"
                label="URL de Video (Youtube/Vimeo)"
                placeholder="https://..."
                onChange={handleVideoChange}
                disabled={disabled}
            />
        </div>
    )
}

