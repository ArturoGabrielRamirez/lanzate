"use client"

import { FileText, Link, Calendar, Download } from "lucide-react"
import { useCallback, useEffect, useMemo } from "react"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { SelectField } from "@/features/global/components/form/select-field"
import { SelectInputField, SelectOption } from "@/features/global/components/form/select-input-field"
import { useCreateProductContext } from "@/features/products/components/create-form/create-product-provider"
import { CreateProductFormType, FileType, FileSizeUnit } from "@/features/products/schemas/create-product-form-schema"

const fileTypeOptions = [
    { value: FileType.PDF, label: "PDF" },
    { value: FileType.DOC, label: "DOC" },
    { value: FileType.DOCX, label: "DOCX" },
    { value: FileType.XLS, label: "XLS" },
    { value: FileType.XLSX, label: "XLSX" },
    { value: FileType.PPT, label: "PPT" },
    { value: FileType.PPTX, label: "PPTX" },
    { value: FileType.JPG, label: "JPG" },
    { value: FileType.JPEG, label: "JPEG" },
    { value: FileType.PNG, label: "PNG" },
    { value: FileType.GIF, label: "GIF" },
    { value: FileType.SVG, label: "SVG" },
    { value: FileType.WEBP, label: "WEBP" },
    { value: FileType.AVIF, label: "AVIF" },
    { value: FileType.MP4, label: "MP4" },
    { value: FileType.WEBM, label: "WEBM" },
    { value: FileType.MP3, label: "MP3" },
    { value: FileType.WAV, label: "WAV" },
    { value: FileType.OGG, label: "OGG" },
    { value: FileType.AAC, label: "AAC" },
    { value: FileType.M4A, label: "M4A" },
    { value: FileType.M4V, label: "M4V" },
    { value: FileType.MOV, label: "MOV" },
    { value: FileType.WMV, label: "WMV" },
    { value: FileType.AVI, label: "AVI" },
    { value: FileType.FLV, label: "FLV" },
    { value: FileType.SWF, label: "SWF" },
]

const fileSizeUnitOptions: SelectOption[] = [
    { value: FileSizeUnit.BYTE, label: "Bytes" },
    { value: FileSizeUnit.KILOBYTE, label: "KB" },
    { value: FileSizeUnit.MEGABYTE, label: "MB" },
    { value: FileSizeUnit.GIGABYTE, label: "GB" },
]

export function DigitalPanel() {
    const { setValue, formState: { isValid, disabled }, clearErrors } = useFormContext<CreateProductFormType>()
    const { values, setValues, setStepValid } = useCreateProductContext()

    const digitalInfo = useMemo(() => values.type_specific_info?.digital || {
        file_url: undefined,
        file_type: undefined,
        file_name: undefined,
        file_size: undefined,
        file_size_unit: FileSizeUnit.MEGABYTE,
        max_downloads: undefined,
        expiration_date: undefined,
    }, [values.type_specific_info?.digital])

    // Sync context with form state on mount and set default values
    useEffect(() => {
        // First, clear any existing errors
        clearErrors([
            "type_specific_info.digital.file_url",
            "type_specific_info.digital.file_type",
            "type_specific_info.digital.file_name",
            "type_specific_info.digital.file_size",
            "type_specific_info.digital.file_size_unit",
            "type_specific_info.digital.max_downloads",
            "type_specific_info.digital.expiration_date",
        ])

        // Then set values without validation or touch
        setValue("type_specific_info.digital.file_url", digitalInfo.file_url || undefined, { shouldValidate: false, shouldTouch: false })
        setValue("type_specific_info.digital.file_type", digitalInfo.file_type || undefined, { shouldValidate: false, shouldTouch: false })
        setValue("type_specific_info.digital.file_name", digitalInfo.file_name || undefined, { shouldValidate: false, shouldTouch: false })
        setValue("type_specific_info.digital.file_size", digitalInfo.file_size || undefined, { shouldValidate: false, shouldTouch: false })
        setValue("type_specific_info.digital.file_size_unit", digitalInfo.file_size_unit || FileSizeUnit.MEGABYTE, { shouldValidate: false, shouldTouch: false })
        setValue("type_specific_info.digital.max_downloads", digitalInfo.max_downloads || undefined, { shouldValidate: false, shouldTouch: false })
        // expiration_date is stored as string (datetime-local format)
        const expirationDateValue = digitalInfo.expiration_date
            ? (typeof digitalInfo.expiration_date === 'string'
                ? digitalInfo.expiration_date
                : formatDateForInput(new Date(digitalInfo.expiration_date)))
            : undefined
        setValue("type_specific_info.digital.expiration_date", expirationDateValue || undefined, { shouldValidate: false, shouldTouch: false })

        // Update context with default values if they weren't set
        if (!digitalInfo.file_size_unit) {
            setValues({
                ...values,
                type_specific_info: {
                    ...values.type_specific_info,
                    digital: {
                        ...digitalInfo,
                        file_size_unit: FileSizeUnit.MEGABYTE,
                    },
                },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Validate step
    useEffect(() => {
        setStepValid(4, isValid)
    }, [isValid, setStepValid])

    const handleFileUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file_url = e.target.value || undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                digital: {
                    ...digitalInfo,
                    file_url,
                },
            },
        })
        setValue("type_specific_info.digital.file_url", file_url, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, digitalInfo])

    const handleFileTypeChange = useCallback((value: string) => {
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                digital: {
                    ...digitalInfo,
                    file_type: value as FileType,
                },
            },
        })
        setValue("type_specific_info.digital.file_type", value as FileType, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, digitalInfo])

    const handleFileNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file_name = e.target.value || undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                digital: {
                    ...digitalInfo,
                    file_name,
                },
            },
        })
        setValue("type_specific_info.digital.file_name", file_name, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, digitalInfo])

    const handleFileSizeChange = useCallback((value: string) => {
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                digital: {
                    ...digitalInfo,
                    file_size_unit: value as FileSizeUnit,
                },
            },
        })
        setValue("type_specific_info.digital.file_size_unit", value as FileSizeUnit, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, digitalInfo])

    const handleFileSizeInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file_size = e.target.value ? parseInt(e.target.value, 10) : undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                digital: {
                    ...digitalInfo,
                    file_size,
                },
            },
        })
        setValue("type_specific_info.digital.file_size", file_size, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, digitalInfo])

    const handleMaxDownloadsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const max_downloads = e.target.value ? parseInt(e.target.value, 10) : undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                digital: {
                    ...digitalInfo,
                    max_downloads,
                },
            },
        })
        setValue("type_specific_info.digital.max_downloads", max_downloads, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, digitalInfo])

    const handleExpirationDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // Store as string (datetime-local format)
        const expiration_date = e.target.value || undefined
        setValues({
            ...values,
            type_specific_info: {
                ...values.type_specific_info,
                digital: {
                    ...digitalInfo,
                    expiration_date,
                },
            },
        })
        setValue("type_specific_info.digital.expiration_date", expiration_date, { shouldValidate: true, shouldDirty: true })
    }, [setValues, setValue, values, digitalInfo])

    // Format date for input (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (date: Date | string | undefined | null): string => {
        if (!date) return ""
        const d = typeof date === 'string' ? new Date(date) : date
        if (isNaN(d.getTime())) return ""
        const year = d.getFullYear()
        const month = String(d.getMonth() + 1).padStart(2, "0")
        const day = String(d.getDate()).padStart(2, "0")
        const hours = String(d.getHours()).padStart(2, "0")
        const minutes = String(d.getMinutes()).padStart(2, "0")
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                    name="type_specific_info.digital.file_url"
                    label="URL del archivo"
                    placeholder="https://ejemplo.com/archivo.pdf"
                    type="url"
                    inputMode="url"
                    onChange={handleFileUrlChange}
                    tooltip="URL donde se encuentra el archivo digital"
                    startIcon={<Link />}
                    disabled={disabled}
                />

                <SelectField
                    name="type_specific_info.digital.file_type"
                    label="Tipo de archivo"
                    options={fileTypeOptions}
                    placeholder="Seleccionar tipo"
                    onChange={handleFileTypeChange}
                    tooltip="Tipo de archivo del producto digital"
                    startIcon={<FileText />}
                    disabled={disabled}
                />

                <InputField
                    name="type_specific_info.digital.file_name"
                    label="Nombre del archivo"
                    placeholder="mi-archivo.pdf"
                    onChange={handleFileNameChange}
                    tooltip="Nombre del archivo que se mostrará al cliente"
                    startIcon={<FileText />}
                    disabled={disabled}
                />

                <SelectInputField
                    selectName="type_specific_info.digital.file_size_unit"
                    inputName="type_specific_info.digital.file_size"
                    label="Tamaño del archivo"
                    selectOptions={fileSizeUnitOptions}
                    selectPlaceholder="Unidad"
                    inputPlaceholder="0"
                    selectValue={digitalInfo.file_size_unit}
                    inputValue={digitalInfo.file_size?.toString()}
                    onSelectChange={handleFileSizeChange}
                    onInputChange={handleFileSizeInputChange}
                    tooltip="Tamaño del archivo digital"
                    inputType="number"
                    inputMode="numeric"
                    inputPattern="[0-9]*"
                    disabled={disabled}
                />

                <InputField
                    name="type_specific_info.digital.max_downloads"
                    label="Máximo de descargas"
                    placeholder="0"
                    type="number"
                    inputMode="numeric"
                    onChange={handleMaxDownloadsChange}
                    tooltip="Número máximo de veces que el cliente puede descargar el archivo (0 = ilimitado)"
                    startIcon={<Download />}
                    disabled={disabled}
                />

                <InputField
                    name="type_specific_info.digital.expiration_date"
                    label="Fecha de expiración"
                    placeholder=""
                    type="date"
                    defaultValue={formatDateForInput(digitalInfo.expiration_date)}
                    onChange={handleExpirationDateChange}
                    tooltip="Fecha y hora en que el archivo dejará de estar disponible para descarga (opcional)"
                    startIcon={<Calendar />}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}
