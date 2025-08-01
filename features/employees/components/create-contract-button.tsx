"use client"

import { useState } from "react"
import { FileText, X } from "lucide-react"
import { Form, InputField, TextareaField } from "@/features/layout/components"
import { FileUpload, FileUploadDropzone, FileUploadList, FileUploadTrigger, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemDelete } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import { ResponseType } from "@/features/layout/types"

type CreateContractButtonProps = {
    storeId: number
    userId: number
}

function CreateContractButton({ storeId, userId }: CreateContractButtonProps) {
    const [files, setFiles] = useState<File[]>([])
    const [open, setOpen] = useState(false)
    const t = useTranslations("store.contracts")

    const handleCreateContract = async (data: any): Promise<ResponseType<any>> => {
        // This is just a placeholder function as requested
        console.log("Contract data:", data)
        console.log("Files:", files)
        return { 
            error: false, 
            message: "Contrato creado exitosamente", 
            payload: null 
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            // Clear files when popup closes
            setFiles([])
        }
    }

    const handleSuccess = () => {
        setOpen(false)
        setFiles([])
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default" type="button">
                    Crear contrato
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Crear nuevo contrato</DialogTitle>
                    <DialogDescription>
                        Sube un PDF y completa la información del contrato
                    </DialogDescription>
                </DialogHeader>
                <Form
                    formAction={handleCreateContract}
                    contentButton="Crear contrato"
                    successMessage="Contrato creado exitosamente"
                    loadingMessage="Creando contrato..."
                    onSuccess={handleSuccess}
                    disabled={true} // Disable form submission as requested
                >
                    <div className="space-y-4">
                        {/* Title Input */}
                        <InputField
                            name="title"
                            label="Título del contrato"
                            placeholder="Ingresa el título del contrato"
                        />

                        {/* PDF Upload */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Documento PDF</label>
                            <FileUpload
                                value={files}
                                onValueChange={setFiles}
                                accept=".pdf"
                                maxFiles={1}
                                maxSize={10 * 1024 * 1024} // 10MB
                            >
                                {files.length === 0 && (
                                    <FileUploadDropzone>
                                        <div className="flex flex-col items-center gap-1 text-center">
                                            <div className="flex items-center justify-center rounded-full border p-2.5">
                                                <FileText className="size-6 text-muted-foreground" />
                                            </div>
                                            <p className="font-medium text-sm">
                                                Arrastra y suelta tu PDF aquí
                                            </p>
                                            <p className="text-muted-foreground text-xs">
                                                O haz clic para buscar archivos
                                            </p>
                                        </div>
                                        <FileUploadTrigger asChild>
                                            <Button variant="outline" size="sm" className="mt-2 w-fit">
                                                Buscar archivos
                                            </Button>
                                        </FileUploadTrigger>
                                    </FileUploadDropzone>
                                )}
                                <FileUploadList className="w-full">
                                    {files.map((file, index) => (
                                        <FileUploadItem key={index} value={file}>
                                            <FileUploadItemPreview />
                                            <FileUploadItemMetadata />
                                            <FileUploadItemDelete asChild>
                                                <Button variant="ghost" size="icon" className="size-7">
                                                    <X />
                                                </Button>
                                            </FileUploadItemDelete>
                                        </FileUploadItem>
                                    ))}
                                </FileUploadList>
                            </FileUpload>
                        </div>

                        {/* Comments Textarea */}
                        <TextareaField
                            name="comments"
                            label="Comentarios adicionales"
                            placeholder="Agrega cualquier comentario o nota adicional sobre el contrato"
                            rows={4}
                        />
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateContractButton 