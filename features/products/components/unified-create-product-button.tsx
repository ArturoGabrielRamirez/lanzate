"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { createProduct } from "../actions/createProduct"
import { productCreateSchema } from "../schemas/product-schema"
import { formatErrorResponse } from "@/utils/lib"
import { DollarSign, FileText, Package, Plus, Tag, Upload, X, ShoppingCart } from "lucide-react"
import { useCallback, useState } from "react"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useTranslations } from "next-intl"
import { UnifiedCreateProductButtonProps } from "../type"

function UnifiedCreateProductButton(props: UnifiedCreateProductButtonProps) {
    const [categories, setCategories] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")
    
    // Determine translation context based on props
    const hasStoreId = 'storeId' in props
    const translationNamespace = hasStoreId ? "store.create-product" : "dashboard.create-product"
    const t = useTranslations(translationNamespace)
    
    const handleAddCategory = (value: any) => {
        setCategories(value)
    }

    const onFileReject = useCallback((file: File, message: string) => {
        const filename = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        
        if (hasStoreId) {
            toast(message, {
                description: t("file-rejected", { filename }),
            })
        } else {
            toast(message, {
                description: `"${filename}" has been rejected`,
            })
        }
    }, [t, hasStoreId])

    const handleCreateProduct = async (payload: any) => {
        try {
            let targetStoreId: number

            if (hasStoreId) {
                targetStoreId = props.storeId
            } else {
                if (!selectedStoreId) {
                    throw new Error(t("messages.select-store-first"))
                }
                targetStoreId = parseInt(selectedStoreId)
            }

            const data = {
                ...payload,
                categories,
                image: files[0]
            }

            const { error, message, payload: product } = await createProduct(data, targetStoreId, props.userId)
            
            if (error) throw new Error(message)
            
            // Reset form for store selection mode
            if (!hasStoreId) {
                setSelectedStoreId("")
                setCategories([])
                setFiles([])
            }
            
            return {
                error: false,
                message: t("messages.success"),
                payload: product
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
        }
    }

    // Get selected store for display (only in store selection mode)
    const selectedStore = !hasStoreId && 'stores' in props 
        ? props.stores.find(store => store.id.toString() === selectedStoreId)
        : null

    const buttonIcon = hasStoreId ? <Plus /> : <ShoppingCart className="size-4" />
    const buttonClassName = hasStoreId ? undefined : "w-full"

    return (
        <ButtonWithPopup
            text={(
                <>
                    {buttonIcon}
                    {t("button")}
                </>
            )}
            schema={productCreateSchema}
            title={t("title")}
            description={t("description")}
            action={handleCreateProduct}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className={buttonClassName}
        >
            <div className="space-y-4">
                {/* Store selector - only show when stores are provided */}
                {!hasStoreId && 'stores' in props && (
                    <div className="space-y-2">
                        <Label htmlFor="store-select">{t("select-store")}</Label>
                        <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                            <SelectTrigger>
                                <SelectValue placeholder={t("choose-store")} />
                            </SelectTrigger>
                            <SelectContent>
                                {props.stores.map((store) => (
                                    <SelectItem key={store.id} value={store.id.toString()}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{store.name}</span>
                                            <span className="text-xs text-muted-foreground">
                                                {store.subdomain}.lanzate.co
                                            </span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedStore && (
                            <p className="text-xs text-muted-foreground">
                                {t("product-will-be-created", { storeName: selectedStore.name })}
                            </p>
                        )}
                    </div>
                )}

                {/* File upload */}
                <FileUpload
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    className={hasStoreId ? "w-full max-w-md" : "w-full"}
                    value={files}
                    onValueChange={setFiles}
                    onFileReject={onFileReject}
                    multiple={false}
                    disabled={files.length > 0}
                >
                    <FileUploadDropzone>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <div className="flex items-center justify-center rounded-full border p-2.5">
                                <Upload className="size-6 text-muted-foreground" />
                            </div>
                            <p className="font-medium text-sm">
                                {hasStoreId ? t("drag-drop") : t("drag-drop-image")}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                {t("click-browse")}
                            </p>
                        </div>
                        <FileUploadTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-2 w-fit">
                                {t("browse-files")}
                            </Button>
                        </FileUploadTrigger>
                    </FileUploadDropzone>
                    <FileUploadList>
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

                {/* Form fields */}
                <InputField 
                    name="name" 
                    label={hasStoreId ? t("name") : t("product-name")} 
                    type="text" 
                    startContent={hasStoreId ? <Tag /> : undefined} 
                />
                <InputField 
                    name="price" 
                    label={t("price")} 
                    type="number" 
                    defaultValue="0" 
                    startContent={hasStoreId ? <DollarSign /> : undefined} 
                />
                <InputField 
                    name="stock" 
                    label={t("stock")} 
                    type="number" 
                    defaultValue="0" 
                    startContent={hasStoreId ? <Package /> : undefined} 
                />
                <InputField 
                    name="description" 
                    label={t("description")} 
                    type="text" 
                    startContent={hasStoreId ? <FileText /> : undefined} 
                />
                <CategorySelect onChange={handleAddCategory} />
            </div>
        </ButtonWithPopup>
    )
}

export default UnifiedCreateProductButton 