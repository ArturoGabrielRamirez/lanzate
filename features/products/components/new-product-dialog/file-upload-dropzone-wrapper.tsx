import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { FileUploadClear, FileUploadDropzone, useFileUpload } from "@/components/ui/file-upload"
import { useCamera } from "@/features/auth/hooks/use-camera"
import { toast } from "sonner"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Camera, Trash, Upload } from "lucide-react"

function FileUploadDropzoneWrapper() {
    const { form } = useMultiStepForm<FormValues>()
    const { files } = useFileUpload((state) => {
        return { files: state.files }
    })

    const camera = useCamera({
        uploadPath: 'product-images',
        onSuccess: (url) => {
            console.log("🚀 ~ BasicInfoStep ~ url:", url)
        },
        onError: (error) => {
            console.error('Camera upload error:', error)
            toast.error('Error al subir la foto')
        },
        quality: 0.9
    })

    const handleCamera = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        e.stopPropagation()
        camera.openCamera();
    }

    const handleDeleteImage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        form.setValue('primary_image', null)
        form.setValue('images', [])
    }

    return (
        <FileUploadDropzone className="rounded-full aspect-square w-full">
            {Array.from(files.entries()).length === 0 && (
                <>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconButton icon={Upload} />
                        </TooltipTrigger>
                        <TooltipContent>
                            Click para explorar archivos
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconButton icon={Camera} onClick={handleCamera} />
                        </TooltipTrigger>
                        <TooltipContent>
                            Click para tomar foto
                        </TooltipContent>
                    </Tooltip>
                </>
            )}
            {Array.from(files.entries()).length > 0 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <FileUploadClear asChild onClick={handleDeleteImage}>
                            <IconButton icon={Trash} />
                        </FileUploadClear>
                    </TooltipTrigger>
                    <TooltipContent>
                        Click para eliminar la imagen
                    </TooltipContent>
                </Tooltip>
            )}
        </FileUploadDropzone>
    )
}

export default FileUploadDropzoneWrapper