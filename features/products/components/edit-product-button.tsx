"use client"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { productUpdateSchema } from "../schemas/product-schema"
import { editProduct } from "../actions/editProduct"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil, Upload, X } from "lucide-react"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { EditProductButtonProps } from "@/features/products/type"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { useCallback, useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { getStoreIdBySlug } from "@/features/categories/data/getStoreIdBySlug"

function EditProductButton({ product, slug, onComplete, userId }: EditProductButtonProps) {

    const [categories, setCategories] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [storeId, setStoreId] = useState<number | null>(null)
    const t = useTranslations("store.edit-product")

    // Obtener el storeId a partir del slug
    useEffect(() => {
        const fetchStoreId = async () => {
            const { payload, error } = await getStoreIdBySlug(slug)
            if (!error && payload) {
                setStoreId(payload)
            }
        }
        fetchStoreId()
    }, [slug])

    const handleAddCategory = (value: any) => {
        setCategories(value)
    }

    const onFileReject = useCallback((file: File, message: string) => {
        const filename = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        toast(message, {
            description: t("file-rejected", { filename }),
        });
    }, [t]);

    const handleEditProduct = async (payload: any) => {

        const data = {
            ...payload,
            categories,
            image: files[0]
        }

        if (!payload.name) return formatErrorResponse(t("validation.name-required"), null, null)
        if (payload.price == null) return formatErrorResponse(t("validation.price-required"), null, null)
        if (payload.stock == null) return formatErrorResponse(t("validation.stock-required"), null, null)
        return editProduct(product.id, data, slug, userId)
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil className="text-muted-foreground size-4" />
                    {t("button")}
                </>
            )}
            title={t("title")}
            schema={productUpdateSchema}
            description={t("description")}
            action={handleEditProduct}
            onComplete={onComplete}
            messages={{
                success: t("messages.success"),
                error: t("messages.error"),
                loading: t("messages.loading")
            }}
            className="bg-transparent w-full justify-start"
        >
            <FileUpload
                maxFiles={1}
                maxSize={2 * 1024 * 1024}
                className="w-full max-w-md"
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
                        <p className="font-medium text-sm">{t("drag-drop")}</p>
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
            <InputField name="name" label={t("name")} type="text" defaultValue={product.name} />
            <InputField name="price" label={t("price")} type="number" defaultValue={String(product.price)} />
            <InputField name="stock" label={t("stock")} type="number" defaultValue={String(product.stock)} />
            <InputField name="description" label={t("description")} type="text" defaultValue={product.description || ""} />
            <CategorySelect 
                onChange={handleAddCategory} 
                defaultValue={product.categories.map((category: any) => ({ label: category.name, value: category.id }))} 
                storeId={storeId || undefined}
            />
        </ButtonWithPopup>
    )
}
export default EditProductButton 