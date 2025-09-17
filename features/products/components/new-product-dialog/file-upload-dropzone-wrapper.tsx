import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { FileUploadClear, FileUploadDropzone, FileUploadItem, FileUploadItemPreview, useFileUpload } from "@/components/ui/file-upload"
import { useCamera } from "@/features/auth/hooks/use-camera"
import { toast } from "sonner"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Camera, Trash, Upload } from "lucide-react"
import CameraComponent from "@/features/auth/components/avatar/camera-component"

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

    const handleCloseCamera = () => {
        camera.closeCamera();
    }

    return (
        <FileUploadDropzone className="rounded-full aspect-square w-full relative overflow-hidden">
            {Array.from(files.entries()).length > 0 && (
                <img src={URL.createObjectURL(files.entries().next().value[0])} alt="Image" className="w-full h-full object-cover absolute" />
            )}
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
            <CameraComponent
                title="Tomar foto"
                onCapture={() => { }}
                onClose={handleCloseCamera}
                isOpen={camera.isOpen}
            />
        </FileUploadDropzone>
    )
}

export default FileUploadDropzoneWrapper