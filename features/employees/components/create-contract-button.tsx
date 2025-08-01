"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { ButtonWithPopup, Form, InputField, TextareaField } from "@/features/layout/components"
import { FileUpload, FileUploadDropzone, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { ResponseType } from "@/features/layout/types"

type CreateContractButtonProps = {
    storeId: number
    userId: number
}

function CreateContractButton({ storeId, userId }: CreateContractButtonProps) {
    const [files, setFiles] = useState<File[]>([])
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

    return (
        <ButtonWithPopup
            text="Crear contrato"
            title="Crear nuevo contrato"
            description="Sube un PDF y completa la información del contrato"
            action={handleCreateContract}
            messages={{
                success: "Contrato creado exitosamente",
                error: "Error al crear el contrato",
                loading: "Creando contrato..."
            }}
            formDisabled={true} // Disable form submission as requested
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
                        <FileUploadList className="w-full" />
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
        </ButtonWithPopup>
    )
}

export default CreateContractButton 