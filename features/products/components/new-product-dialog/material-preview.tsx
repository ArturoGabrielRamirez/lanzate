import { Material } from "@prisma/client"
import { Check } from "lucide-react"

type Props = {
    material: Material & { selected: boolean }
}

const MaterialPreview = ({ material }: Props) => {
    return (
        <div className="flex gap-2 flex-col">
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