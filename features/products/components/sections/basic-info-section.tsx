"use client"

import { Box, Barcode, FileText, Link, Tag } from "lucide-react"
import { InputField } from "@/features/layout/components"
import { useRef } from "react"
import { useFormContext } from "react-hook-form"

export function BasicInfoSection() {
    const { setValue } = useFormContext()
    const slugEditedRef = useRef(false)

    function slugify(input: string): string {
        return input
            .normalize("NFD").replace(/\p{Diacritic}/gu, "")
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "")
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.value
        if (!slugEditedRef.current) {
            const nextSlug = slugify(name)
            setValue("slug", nextSlug, { shouldValidate: true, shouldDirty: true })
        }
    }

    function handleSlugChange() {
        // Mark slug as manually edited so we stop auto-syncing from name
        if (!slugEditedRef.current) slugEditedRef.current = true
    }
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="name"
                    label={"Nombre"}
                    type="text"
                    placeholder={"Ej: Coca Cola"}
                    startContent={<Box />}
                    onChange={handleNameChange}
                />
                <InputField
                    name="slug"
                    label={"Slug"}
                    type="text"
                    placeholder={"Ej: coca-cola"}
                    startContent={<Link />}
                    onChange={handleSlugChange}
                />
            </div>
            <InputField
                name="description"
                label={"Descripción"}
                isTextArea={true}
                placeholder={"Ej: Este producto es una bebida gaseosa..."}
                startContent={<FileText />}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="sku"
                    label={"SKU"}
                    type="text"
                    placeholder="Ej: 1234567890"
                    startContent={<Tag />}
                />
                <InputField
                    name="barcode"
                    label={"Código de barras"}
                    type="text"
                    placeholder="Ej: 1234567890"
                    startContent={<Barcode />}
                />
            </div>
        </div>
    )
}

export default BasicInfoSection


