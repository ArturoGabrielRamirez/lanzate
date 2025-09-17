import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { useEffect, useState, useTransition } from "react"
import { getMaterials } from "../../actions/getMaterials"
import { Material } from "@prisma/client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FileUpload, FileUploadDropzone } from "@/components/ui/file-upload"
import FileUploadDropzoneWrapper from "./file-upload-dropzone-wrapper"

type Props = {
    storeId: number
}
const MaterialsSelector = ({ storeId }: Props) => {

    const { form } = useMultiStepForm<FormValues>()

    const [materials, setMaterials] = useState<Material[]>([])
    const [selectNewMaterial, setSelectNewMaterial] = useState<boolean>(false)
    const [isPending, startTransition] = useTransition()
    const [file, setFile] = useState<File | null>(null)

    useEffect(() => {

        const load = async () => {
            const { payload, error } = await getMaterials({ store_id: storeId })
            if (error) return
            setMaterials(payload)
        }

        load()

    }, [])

    const handleAddNewMaterial = () => {
        setSelectNewMaterial(true)
    }

    const handleCancelAddMaterial = () => {
        setSelectNewMaterial(false)
    }

    const handleFileChange = (files: File[]) => {
        setFile(files[0])
    }

    return (
        <div>
            <div className="flex flex-wrap items-center gap-4">
                {materials.map((material) => (
                    <div key={material.id}>{material.label}</div>
                ))}
                {selectNewMaterial && (
                    <div className="space-y-4 max-w-[150px]">
                        <FileUpload
                            className="w-full"
                            onValueChange={handleFileChange}
                            maxFiles={1}
                            accept="image/jpg, image/png, image/jpeg"
                            maxSize={2 * 1024 * 1024}
                        >
                            <FileUploadDropzoneWrapper />
                        </FileUpload>
                        <Input placeholder="Ej: Jean, Madera, etc." />
                    </div>
                )}
            </div>
            <Tooltip>
                <TooltipTrigger asChild>
                    <IconButton
                        icon={selectNewMaterial ? X : Plus}
                        onClick={selectNewMaterial ? handleCancelAddMaterial : handleAddNewMaterial}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>Agregar color</p>
                </TooltipContent>
            </Tooltip>
        </div>
    )
}
export default MaterialsSelector