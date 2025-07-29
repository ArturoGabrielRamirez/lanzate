"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { createProduct } from "@/features/products/actions/createProduct"
import { productCreateSchema } from "@/features/products/schemas/product-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Plus, Upload, X, ShoppingCart } from "lucide-react"
import { useCallback, useState } from "react"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { DashboardStore } from "../types/types"
import { useTranslations } from "next-intl"

type CreateProductForStoreButtonProps = {
    userId: number
    stores: DashboardStore[]
}

function CreateProductForStoreButton({ userId, stores }: CreateProductForStoreButtonProps) {
    const [categories, setCategories] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [selectedStoreId, setSelectedStoreId] = useState<string>("")
    const t = useTranslations("dashboard.create-product")

    const handleAddCategory = (value: any) => {
        setCategories(value)
    }

    const onFileReject = useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        })
    }, [])

    const handleCreateProduct = async (payload: any) => {
        try {
            if (!selectedStoreId) {
                throw new Error(t("messages.select-store-first"))
            }

            const data = {
                ...payload,
                categories,
                image: files[0]
            }

            const { error, message, payload: product } = await createProduct(data, parseInt(selectedStoreId), userId)
            if (error) throw new Error(message)
            
            // Reset form
            setSelectedStoreId("")
            setCategories([])
            setFiles([])
            
            return {
                error: false,
                message: t("messages.success"),
                payload: product
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
        }
    }

    const selectedStore = stores.find(store => store.id.toString() === selectedStoreId)

    return (
        <ButtonWithPopup
            text={(
                <>
                    <ShoppingCart className="size-4" />
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
            className="w-full"
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="store-select">{t("select-store")}</Label>
                    <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("choose-store")} />
                        </SelectTrigger>
                        <SelectContent>
                            {stores.map((store) => (
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

                <FileUpload
                    maxFiles={1}
                    maxSize={2 * 1024 * 1024}
                    className="w-full"
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
                            <p className="font-medium text-sm">{t("drag-drop-image")}</p>
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

                <InputField name="name" label={t("product-name")} type="text" />
                <InputField name="price" label={t("price")} type="number" defaultValue="0" />
                <InputField name="stock" label={t("stock")} type="number" defaultValue="0" />
                <InputField name="description" label={t("description")} type="text" />
                <CategorySelect onChange={handleAddCategory} />
            </div>
        </ButtonWithPopup>
    )
}

export default CreateProductForStoreButton 