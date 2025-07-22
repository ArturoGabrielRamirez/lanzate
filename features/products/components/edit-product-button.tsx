"use client"
import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { productUpdateSchema } from "../schemas/product-schema"
import { editProduct } from "../actions/editProduct"
import { formatErrorResponse } from "@/utils/lib"
import { Pencil, Upload, X } from "lucide-react"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { EditProductButtonProps } from "@/features/products/type"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

function EditProductButton({ product, slug, onComplete, userId }: EditProductButtonProps) {

    const [categories, setCategories] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])

    const handleAddCategory = (value: any) => {
        setCategories(value)
    }

    const onFileReject = useCallback((file: File, message: string) => {
        toast(message, {
            description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
        });
    }, []);

    const handleEditProduct = async (payload: any) => {

        const data = {
            ...payload,
            categories,
            image: files[0]
        }

        if (!payload.name) return formatErrorResponse("Name is required", null, null)
        if (payload.price == null) return formatErrorResponse("Price is required", null, null)
        if (payload.stock == null) return formatErrorResponse("Stock is required", null, null)
        return editProduct(product.id, data, slug, userId)
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Pencil />
                    Edit Product
                </>
            )}
            title="Edit product"
            schema={productUpdateSchema}
            description="Edit the details of your product"
            action={handleEditProduct}
            onComplete={onComplete}
            messages={{
                success: "Product updated successfully!",
                error: "Failed to update product",
                loading: "Updating product..."
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
                        <p className="font-medium text-sm">Drag & drop files here</p>
                        <p className="text-muted-foreground text-xs">
                            Or click to browse (max 1 files, up to 2MB each)
                        </p>
                    </div>
                    <FileUploadTrigger asChild>
                        <Button variant="outline" size="sm" className="mt-2 w-fit">
                            Browse files
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
            <InputField name="name" label="Name" type="text" defaultValue={product.name} />
            <InputField name="price" label="Price" type="number" defaultValue={String(product.price)} />
            <InputField name="stock" label="Stock" type="number" defaultValue={String(product.stock)} />
            <InputField name="description" label="Description" type="text" defaultValue={product.description || ""} />
            <CategorySelect onChange={handleAddCategory} defaultValue={product.categories.map((category: any) => ({ label: category.name, value: category.id }))} />
        </ButtonWithPopup>
    )
}
export default EditProductButton 