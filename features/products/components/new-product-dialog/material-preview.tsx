import { Material } from "@prisma/client"
import { Check } from "lucide-react"

type Props = {
    material: Material & { selected: boolean }
}

const MaterialPreview = ({ material }: Props) => {
    return (
        <div className="flex gap-2 flex-col">
            {material.image_url ? (
                <img src={material.image_url} alt={material.label} className="size-16 object-cover rounded-md" />
            ) : (
                <div className="size-16 rounded-full border bg-muted" />
            )}
            <span className="text-sm font-medium flex items-center gap-2">
                {material.label}
                {material.selected && (
                    <Check className="size-4 text-green-500" />
                )}
            </span>
        </div>
    )
}
export default MaterialPreview