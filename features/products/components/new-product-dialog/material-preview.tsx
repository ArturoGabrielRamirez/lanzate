import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { Material } from "@prisma/client"
import { Check, Trash, X } from "lucide-react"

type Props = {
    material: Material & { selected: boolean }
}

const MaterialPreview = ({ material }: Props) => {

    const handleToggleSelected = () => {

    }

    const handleDeleteMaterial = () => {

    }

    return (
        <div className="flex gap-2 flex-col group" onClick={handleToggleSelected}>
            <div className="relative border rounded-md">
                {material.image_url ? (
                    <img src={material.image_url} alt={material.label} className="size-16 object-cover rounded-md" />
                ) : (
                    <div className="size-16 rounded-full border bg-muted" />
                )}
                {material.selected && (
                    <div className="absolute top-0 right-0 grid place-items-center w-full h-full bg-background/90 rounded-md">
                        <Check className="size-6 text-green-500" />
                    </div>
                )}
                <div className="absolute top-0 right-0 w-full h-full bg-background/90 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconButton
                                icon={Trash}
                                onClick={handleToggleSelected}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Eliminar material</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <IconButton
                                icon={Check}
                                onClick={handleToggleSelected}
                            />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Agregar material</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </div>
            <div className="text-sm font-medium flex items-center gap-2">
                <p className="truncate max-w-[40px]">{material.label}</p>
                {material.selected && (
                    <Check className="size-4 text-green-500 shrink-0" />
                )}
            </div>
        </div>
    )
}
export default MaterialPreview