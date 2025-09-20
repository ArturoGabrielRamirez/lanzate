import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { useEffect, useState, useTransition } from "react"
import { getMaterials } from "../../actions/getMaterials"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Check, Loader, Plus, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FileUpload } from "@/components/ui/file-upload"
import FileUploadDropzoneWrapper from "./file-upload-dropzone-wrapper"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { FormField, FormInfoLabel } from "@/components/ui/form"
import { toast } from "sonner"
import { createMaterialAction } from "../../actions/createMaterialAction"
import { createMaterialDynamic } from "../../actions/createMaterialDynamic"
import MaterialPreview from "./material-preview"
import { Material } from "@prisma/client"

type Props = {
    storeId: number
}
const MaterialsSelector = ({ storeId }: Props) => {

    const { form } = useMultiStepForm<FormValues>()

    const [materials, setMaterials] = useState<(Material & { selected: boolean })[]>([])
    const [selectNewMaterial, setSelectNewMaterial] = useState<boolean>(false)
    const [file, setFile] = useState<File | null>(null)
    const [materialLabel, setMaterialLabel] = useState<string>("")
    const [materialPublicUrl, setMaterialPublicUrl] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()
    const [isGettingMaterials, startGettingMaterialsTransition] = useTransition()

    useEffect(() => {

        const load = async () => {
            startGettingMaterialsTransition(async () => {

                const localData = localStorage.getItem("create-product-new")
                const { payload, error } = await getMaterials({ store_id: storeId })

                if (error) return

                if (localData) {
                    const data = JSON.parse(localData)
                    const newPayload = payload.map((material: Material & { selected: boolean }) => {
                        if (data.materials.some((m: { name: string, id: number }) => m.name === material.label && m.id === material.id)) {
                            return { ...material, selected: true }
                        }
                        return material
                    })
                    setMaterials(newPayload)
                    form.setValue('materials', newPayload.filter((material: Material & { selected: boolean }) => material.selected).map((material: Material & { selected: boolean }) => ({ value: new File([], material.label), name: material.label, id: material.id })))
                } else {
                    setMaterials(payload)
                    form.setValue('materials', [])
                }

            })
        }

        load()

    }, [])

    const handleAddNewMaterial = () => {
        setSelectNewMaterial(true)
    }

    const handleCancelAddMaterial = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setSelectNewMaterial(false)
    }

    const handleFileChange = async (files: File[]) => {
        setFile(files[0])
        form.setValue(`materials.${materials.length}.value`, files[0])
        try {
            toast.loading("Subiendo imagen del material...")

            const { error, message, payload } = await createMaterialAction(files[0], storeId)

            if (error) throw new Error(message)

            toast.dismiss()
            toast.success("Imagen del material subida correctamente")
            setMaterialPublicUrl(payload.url)
        } catch (error) {
            console.error(error)
            toast.dismiss()
            toast.error("Error al subir la imagen del material")
        }
    }

    const handleConfirmAddMaterial = () => {
        form.trigger(`materials.${materials.length}`)

        if (form.formState.errors.materials || !materialPublicUrl || !materialLabel) return

        startTransition(async () => {

            toast.loading("Agregando material...")

            try {

                const { error, message, payload } = await createMaterialDynamic({
                    label: materialLabel,
                    image_url: materialPublicUrl,
                    store_id: storeId
                })
                console.log("🚀 ~ handleConfirmAddMaterial ~ payload:", payload)

                if (error) throw new Error(message)

                toast.dismiss()
                toast.success("Material agregado correctamente")
                setMaterials([...materials, payload])
            } catch (error) {
                console.error(error)
                toast.dismiss()
                toast.error("Error al agregar el material")
            }
        })

        setSelectNewMaterial(false)
        setMaterialLabel("")
        setFile(null)
        setMaterialPublicUrl(null)
    }

    const handleMaterialLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaterialLabel(e.target.value)
        form.setValue(`materials.${materials.length}.name`, e.target.value)
    }

    const handleDeleteMaterial = (material: Material & { selected: boolean }) => {
        setMaterials(materials.filter((m) => m.id !== material.id))
    }

    const handleToggleSelected = (material: Material & { selected: boolean }) => {

        const next = materials.map((m) => m.id === material.id ? { ...m, selected: !m.selected } : m)
        setMaterials(next)
        form.setValue('materials', next.filter((m) => m.selected).map((m) => ({ value: new File([], m.image_url || ""), name: m.label || "", id: m.id })))
    }

    return (
        <div>
            <div className="flex flex-wrap items-center gap-4">
                {materials.map((material) => (
                    <MaterialPreview
                        key={material.id}
                        material={material}
                        onDelete={handleDeleteMaterial}
                        onToggleSelected={handleToggleSelected}
                    />
                ))}
                {isGettingMaterials && (
                    <div className="flex items-center gap-2">
                        <Loader className="size-4 animate-spin" />
                        <p>Cargando materiales...</p>
                    </div>
                )}
                <Popover open={selectNewMaterial} onOpenChange={setSelectNewMaterial}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <PopoverTrigger asChild>
                                <IconButton
                                    icon={selectNewMaterial ? X : Plus}
                                    onClick={selectNewMaterial ? handleCancelAddMaterial : handleAddNewMaterial}
                                />
                            </PopoverTrigger>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Agregar color</p>
                        </TooltipContent>
                    </Tooltip>
                    <PopoverContent>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name={`materials.${materials.length}.name`}
                                render={() => (
                                    <>
                                        <FormField
                                            control={form.control}
                                            name={`materials.${materials.length}.value`}
                                            render={() => (
                                                <>
                                                    <FormInfoLabel>
                                                        Imagen
                                                    </FormInfoLabel>
                                                    <FileUpload
                                                        className="w-full max-w-[150px] mx-auto"
                                                        onValueChange={handleFileChange}
                                                        maxFiles={1}
                                                        accept="image/jpg, image/png, image/jpeg"
                                                        maxSize={2 * 1024 * 1024}
                                                    >
                                                        <FileUploadDropzoneWrapper />
                                                    </FileUpload>
                                                </>
                                            )}
                                        />
                                        <FormInfoLabel>
                                            Nombre
                                        </FormInfoLabel>
                                        <Input
                                            placeholder="Ej: Jean, Madera, etc."
                                            value={materialLabel}
                                            {...form.register(`materials.${materials.length}.name`)}
                                            onChange={handleMaterialLabelChange}
                                        />
                                        <Button className="w-full" onClick={handleConfirmAddMaterial}>
                                            <Check className="mr-1 size-4" />
                                            Confirmar
                                        </Button>
                                    </>
                                )}
                            />

                        </div>
                    </PopoverContent>
                </Popover>
            </div>

        </div>
    )
}
export default MaterialsSelector