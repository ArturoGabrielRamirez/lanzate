import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { useEffect, useState } from "react"
import * as motion from "motion/react-client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { FileUpload } from "@/components/ui/file-upload"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Box, Globe, Info } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import CategoryTagsSelect from "@/features/store-landing/components/category-tags-select"
import FileUploadDropzoneWrapper from "./file-upload-dropzone-wrapper"

function BasicInfoStep({ storeId }: { storeId: number }) {
    const { form } = useMultiStepForm<FormValues>()
    const [categories, setCategories] = useState<{ label: string, value: string }[]>([])


    useEffect(() => {
        const localData = localStorage.getItem('create-product-new')
        if (localData) {
            const data = JSON.parse(localData)
            setCategories(data.categories)
        }
    }, [])

    const handleSaveCategories = (vals: { label: string, value: string }[]) => {
        form.setValue('categories', vals)
    }

    const handleFileSelect = (files: File[]) => {
        form.setValue('primary_image', files[0])
        form.setValue('images', files)
    }


    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                <div className="flex items-center gap-8 flex-col md:flex-row">
                    <FormField
                        control={form.control}
                        name="primary_image"
                        render={({ field }) => (
                            <FileUpload
                                className="shrink-0 max-w-[150px] w-full"
                                onValueChange={handleFileSelect}
                                maxFiles={1}
                                maxSize={2 * 1024 * 1024}
                                accept="image/jpg, image/png, image/jpeg"
                                value={field.value ? [field.value] : []}
                            >
                                <FileUploadDropzoneWrapper />
                            </FileUpload>
                        )}
                    />
                    <div className="space-y-3 w-full">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className="flex text-muted-foreground/50">
                                            Name <span className="text-red-500">*</span>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Info className="size-4 cursor-pointer" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>El nombre del producto</p>
                                                    <p>Ej: Coca Cola</p>
                                                    <FormMessage className="text-foreground text-xs" />
                                                </TooltipContent>
                                            </Tooltip>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Ej: Coca Cola"
                                                startContent={<Box />}
                                                autoFocus
                                            />
                                        </FormControl>
                                    </FormItem>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex text-muted-foreground/50">
                                        URL <span className="text-red-500">*</span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="size-4 cursor-pointer" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>La URL del producto</p>
                                                <p>Ej: coca-cola</p>
                                                <FormMessage className="text-foreground text-xs" />
                                            </TooltipContent>
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type="url"
                                            placeholder="Ej: coca-cola"
                                            inputMode="url"
                                            startContent={<Globe />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className="space-y-3 mt-4">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex text-muted-foreground/50">
                                    Description
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="size-4 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>La descripción del producto</p>
                                            <p>Ej: Bebida gaseosa energética</p>
                                            <FormMessage className="text-foreground text-xs" />
                                        </TooltipContent>
                                    </Tooltip>

                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ej: Bebida gaseosa energética"
                                        className="w-full p-2 text-sm border rounded min-h-[80px] placeholder:text-muted-foreground/50"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <CategoryTagsSelect
                        storeId={storeId}
                        defaultValue={categories}
                        onChange={handleSaveCategories} />
                </div>
            </Form>
        </motion.div>
    )
}

export default BasicInfoStep