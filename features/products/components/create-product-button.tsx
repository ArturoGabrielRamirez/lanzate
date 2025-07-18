"use client"

import { ButtonWithPopup, InputField } from "@/features/layout/components"
import { createProduct } from "../actions/createProduct"
import { productCreateSchema } from "../schemas/product-schema"
import { formatErrorResponse } from "@/utils/lib"
import { Plus, Upload, X } from "lucide-react"
import { useCallback, useState } from "react"
import { CreateProductButtonProps } from "@/features/products/type"
import CategorySelect from "@/features/store-landing/components/category-select-"
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList, FileUploadTrigger } from "@/components/ui/file-upload";
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

function CreateProductButton({ storeId }: CreateProductButtonProps) {

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

    const handleCreateProduct = async (payload: any) => {
        try {

            const data = {
                ...payload,
                categories,
                image: files[0]
            }

            const { error, message, payload: product } = await createProduct(data, storeId)
            if (error) throw new Error(message)
            return {
                error: false,
                message: "Product created successfully",
                payload: product
            }
        } catch (error) {
            return formatErrorResponse("Error creating product", error, null)
        }
    }

    return (
        <ButtonWithPopup
            text={(
                <>
                    <Plus />
                    Create Product
                </>
            )}
            schema={productCreateSchema}
            title="Create new product"
            description="Create a new product to start selling your products! Choose a name for your product and click on the button below, you can continue to add more details of the product once it's created."
            action={handleCreateProduct}
            messages={{
                success: "Product created successfully!",
                error: "Failed to create product",
                loading: "Creating product..."
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
            <InputField name="name" label="Name" type="text" />
            <InputField name="price" label="Price" type="number" defaultValue="0" />
            <InputField name="stock" label="Stock" type="number" defaultValue="0" />
            <InputField name="description" label="Description" type="text" />
            <CategorySelect onChange={handleAddCategory} />
        </ButtonWithPopup>
    )
}
export default CreateProductButton