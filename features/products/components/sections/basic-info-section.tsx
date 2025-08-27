"use client"

import { Box, Barcode, FileText, Link, Tag } from "lucide-react"
import { InputField } from "@/features/layout/components"

export function BasicInfoSection() {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="name"
                    label={"Nombre"}
                    type="text"
                    placeholder={"Ej: Coca Cola"}
                    startContent={<Box />}
                />
                <InputField
                    name="slug"
                    label={"Slug"}
                    type="text"
                    placeholder={"Ej: coca-cola"}
                    startContent={<Link />}
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


