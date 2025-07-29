"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { createProduct } from "../actions/createProduct"
import { productCreateSchema } from "../schemas/product-schema"
import { formatErrorResponse } from "@/utils/lib"
import { DollarSign, FileText, Package, Plus, Tag, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import { CreateProductButtonProps } from "@/features/products/type"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"

function CreateProductButton({ storeId, userId }: CreateProductButtonProps) {

    const [categories, setCategories] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const t = useTranslations("store.create-product")

    const handleAddCategory = (value: any) => {
        setCategories(value)
    }

    const onFileReject = useCallback((file: File, message: string) => {
        const filename = file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        toast(message, {
            description: t("file-rejected", { filename }),
        });
    }, [t]);

    const handleCreateProduct = async (payload: any) => {
        try {

            const data = {
                ...payload,
                categories,
                image: files[0]
            }

            const { error, message, payload: product } = await createProduct(data, storeId, userId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: t("messages.success"),
                payload: product
            }
        } catch (error) {
            return formatErrorResponse(t("messages.error"), error, null)
        }
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Plus />
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
            <InputField name="name" label={t("name")} type="text" startContent={<Tag />} />
            <InputField name="price" label={t("price")} type="number" defaultValue="0" startContent={<DollarSign />} />
            <InputField name="stock" label={t("stock")} type="number" defaultValue="0" startContent={<Package />} />
            <InputField name="description" label={t("description")} type="text" startContent={<FileText />} />
            <CategorySelect onChange={handleAddCategory} />
        </ButtonWithPopup>
    )
}
export default CreateProductButton