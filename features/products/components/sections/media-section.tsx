"use client"

import { Button } from "@/components/ui/button"
import { FileUpload, FileUploadCameraTrigger, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Upload, X } from "lucide-react"
import { useCallback, useState, useEffect } from "react"
import { useFormContext } from "react-hook-form"
import type { MediaSectionData } from "@/features/products/type/create-form-extra"

type Props = {
    value?: MediaSectionData
    onChange?: (data: MediaSectionData) => void
    onFileReject?: (file: File, message: string) => void
}

export function MediaSection({ value, onChange, onFileReject }: Props) {
    const { setValue } = useFormContext()
    const [files, setFiles] = useState<File[]>(value?.files ?? [])
    const [primaryIndex, setPrimaryIndex] = useState<number | null>(value?.primaryIndex ?? null)
    const [error, setError] = useState("")
    // no-op ref (reserved for future diff logic)

    const handleChange = useCallback((next: File[]) => {
        setFiles(next)
        if (next.length > 0) setError("")
        onChange?.({ files: next, primaryIndex })
    }, [onChange, primaryIndex])

    useEffect(() => {
        setValue("images", files, { shouldDirty: true, shouldTouch: true })
        setValue("primary-image", primaryIndex, { shouldDirty: true, shouldTouch: true })
    }, [files, primaryIndex, setValue])

    return (
        <div className="space-y-4">
            <FileUpload
                maxFiles={5}
                maxSize={2 * 1024 * 1024}
                className="w-full"
                value={files}
                onValueChange={handleChange}
                onFileReject={(f, m) => { setError(m); onFileReject?.(f, m) }}
                multiple={true}
                disabled={files.length >= 5}
                accept="image/jpg, image/png, image/jpeg"
            >
                <FileUploadDropzone>
                    <div className="flex flex-col items-center gap-1 text-center">
                        <div className="flex items-center justify-center rounded-full border p-2.5">
                            <Upload className="size-6 text-muted-foreground" />
                        </div>
                        <p className="font-medium text-sm">Arrastra y suelta archivos aquí</p>
                        <p className="text-muted-foreground text-xs">O haz click para explorar</p>
                    </div>
                    <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                            Explorar archivos
                        </Button>
                    </FileUploadTrigger>
                    <FileUploadCameraTrigger />
                </FileUploadDropzone>
                <FileUploadList className="w-full">
                    {files.map((file, index) => (
                        <FileUploadItem key={index} value={file}>
                            <FileUploadItemPreview />
                            <FileUploadItemMetadata />
                            <div className="ml-auto flex items-center gap-2">
                                <Label htmlFor={`primary-${index}`} className="text-xs">Primaria</Label>
                                <Switch
                                    id={`primary-${index}`}
                                    checked={primaryIndex === index || (files.length === 1 && index === 0)}
                                    disabled={files.length === 1}
                                    onCheckedChange={(checked) => {
                                        const next = checked ? index : (files.length > 1 ? null : 0)
                                        setPrimaryIndex(next)
                                        onChange?.({ files, primaryIndex: next })
                                    }}
                                />
                            </div>
                            <FileUploadItemDelete asChild>
                                <Button variant="ghost" size="icon" className="size-7">
                                    <X />
                                </Button>
                            </FileUploadItemDelete>
                        </FileUploadItem>
                    ))}
                </FileUploadList>
            </FileUpload>
            {error && (
                <p className="text-destructive text-sm">{error}</p>
            )}
        </div>
    )
}

export default MediaSection


