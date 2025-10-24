"use client"

import { useState, useEffect } from "react"
import { FileText, X, Download, Eye, FilePlus } from "lucide-react"
import { Form, InputField, TextareaField } from "@/features/layout/components"
import { FileUpload, FileUploadDropzone, FileUploadList, FileUploadTrigger, FileUploadItem, FileUploadItemPreview, FileUploadItemMetadata, FileUploadItemDelete } from "@/features/shadcn/components/ui/file-upload"
import { Button } from "@/features/shadcn/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/features/shadcn/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/features/shadcn/components/ui/card"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { insertContract, getContracts, checkStorageBucket } from "@/features/employees/data"
import { Contract } from "@/features/employees/types"
import { toast } from "sonner"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import AccordionTriggerWithValidation from "@/features/branches/components/accordion-trigger-with-validation"
import { yupResolver } from "@hookform/resolvers/yup"
import { contractCreateSchema } from "@/features/employees/schemas/employee-schema"
import { yupResolverFlexible } from "../types/yup-resolver-flexible"
type CreateContractButtonProps = {
    storeId: number
    userId: number
}

function CreateContractButton({ storeId, userId }: CreateContractButtonProps) {
    const [files, setFiles] = useState<File[]>([])
    const [open, setOpen] = useState(false)
    const [contracts, setContracts] = useState<Contract[]>([])
    const [loading, setLoading] = useState(false)
    const [bucketChecked, setBucketChecked] = useState(false)

    // Cargar contratos existentes cuando se abre el popup
    useEffect(() => {
        if (open) {
            loadContracts()
            checkBucket()
        }
    }, [open])

    const checkBucket = async () => {
        try {
            const result = await checkStorageBucket()
            if (result.error) {
                toast.error(result.message)
            }
            setBucketChecked(true)
        } catch (error) {
            console.error("Error checking bucket:", error)
            setBucketChecked(true)
        }
    }

    const loadContracts = async () => {
        setLoading(true)
        try {
            const result = await getContracts(storeId)
            if (!result.error && result.payload) {
                setContracts(result.payload)
            }
        } catch (error) {
            console.error("Error loading contracts:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateContract = async (data: any) => {
        try {
            // Validar que se haya subido un archivo
            if (files.length === 0) {
                return {
                    error: true,
                    message: "Debes subir un archivo PDF",
                    payload: null
                }
            }

            const payload = {
                ...data,
                file: files
            }

            const result = await insertContract(payload, storeId, userId)

            // Si hay error, retornarlo
            if (result.error) {
                return {
                    error: true,
                    message: result.message,
                    payload: null
                }
            }

            // Limpiar archivos y recargar contratos
            setFiles([])
            await loadContracts()

            return {
                error: false,
                message: "Contrato creado exitosamente",
                payload: result.payload
            }
        } catch (error) {
            console.error("Error creating contract:", error)
            return {
                error: true,
                message: error instanceof Error ? error.message : "Error creating contract",
                payload: null
            }
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

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'secondary'
            case 'APPROVED':
                return 'default'
            case 'REJECTED':
                return 'destructive'
            case 'COMPLETED':
                return 'default'
            case 'EXPIRED':
                return 'outline'
            default:
                return 'secondary'
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="default" type="button">
                    Contratos
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Gestionar Contratos</DialogTitle>
                    <DialogDescription>
                        Sube nuevos contratos y revisa los existentes
                    </DialogDescription>
                </DialogHeader>

                <Form
                    formAction={handleCreateContract}
                    contentButton="Crear contrato"
                    successMessage="Contrato creado exitosamente"
                    loadingMessage="Creando contrato..."
                    onSuccess={handleSuccess}
                    disabled={false}
                    resolver={yupResolverFlexible(contractCreateSchema)}
                >
                    <Accordion type="single" collapsible defaultValue="item-1">
                        <AccordionItem value="item-1">
                            <AccordionTrigger>
                                <span className="flex items-center gap-2">
                                    <FileText className="size-4" />
                                    Contratos existentes
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-4">
                                {loading ? (
                                    <div className="text-center py-4">Cargando contratos...</div>
                                ) : contracts.length === 0 ? (
                                    <div className="text-center py-4 text-muted-foreground">
                                        No hay contratos subidos aún
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {contracts.map((contract) => (
                                            <Card key={contract.id} className="p-4">
                                                <CardHeader className="p-0 pb-2">
                                                    <div className="flex items-center justify-between">
                                                        <CardTitle className="text-base">{contract.title}</CardTitle>
                                                        <Badge variant={getStatusBadgeVariant(contract.status)}>
                                                            {contract.status}
                                                        </Badge>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="p-0">
                                                    <div className="flex items-center justify-between">
                                                        <div className="text-sm text-muted-foreground">
                                                            Creado: {formatDate(contract.created_at)}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => window.open(contract.file_url, '_blank')}
                                                            >
                                                                <Eye className="w-4 h-4 mr-1" />
                                                                Ver
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const link = document.createElement('a')
                                                                    link.href = contract.file_url
                                                                    link.download = contract.title
                                                                    link.click()
                                                                }}
                                                            >
                                                                <Download className="w-4 h-4 mr-1" />
                                                                Descargar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    {contract.comments && (
                                                        <div className="mt-2 text-sm text-muted-foreground">
                                                            <strong>Comentarios:</strong> {contract.comments}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTriggerWithValidation keys={["title"]}>
                                <span className="flex items-center gap-2">
                                    <FilePlus className="size-4" />
                                    Agregar contrato
                                </span>
                            </AccordionTriggerWithValidation>
                            <AccordionContent className="space-y-4">
                                {!bucketChecked ? (
                                    <div className="text-center py-4">Verificando configuración...</div>
                                ) : (

                                    <div className="space-y-4">
                                        {/* Title Input */}
                                        <InputField
                                            name="title"
                                            label="Título del contrato"
                                            type="text"
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
                                                        <FileUploadItem key={index} value={file} className="max-w-full">
                                                            <FileUploadItemPreview />
                                                            <FileUploadItemMetadata className="truncate min-w-0 flex-1" />
                                                            <FileUploadItemDelete asChild>
                                                                <Button variant="ghost" size="icon" className="size-7 flex-shrink-0">
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
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default CreateContractButton 