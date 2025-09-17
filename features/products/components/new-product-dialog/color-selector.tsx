import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ColorPicker, ColorPickerFormat, ColorPickerHue, ColorPickerSelection, ColorPickerEyeDropper } from "@/components/ui/shadcn-io/color-picker"
import Color, { ColorLike } from "color"
import { CheckIcon, Loader2, Trash } from "lucide-react"
import { useState, useTransition } from "react"
import { FormValues } from "./validation-schemas"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { IconButton } from "@/src/components/ui/shadcn-io/icon-button"
import { createColorDynamic } from "../../actions/createColorDynamic"
import { toast } from "sonner"

const ColorSelector = ({ storeId, onCreated }: { storeId: number, onCreated?: (color: string, name: string) => void }) => {
    const { form } = useMultiStepForm<FormValues>()

    const [selectedColor, setSelectedColor] = useState<string>("#ffffffff")
    const [open, setOpen] = useState(true)
    const [fantasyName, setFantasyName] = useState<string>("Blanco")
    const [isPending, startTransition] = useTransition()

    const handleColorChange = (color: ColorLike) => {
        const c = Color(color)
        const [r, g, b] = c.rgb().array()
        const hexColor = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
        setSelectedColor(hexColor)
    }

    const handleConfirm = () => {
        startTransition(async () => {
            try {
                toast.loading("Agregando color...")
                const { error, message } = await createColorDynamic({ name: fantasyName, value: selectedColor, store_id: storeId })
                if (error) throw new Error(message)
                toast.dismiss()
                toast.success("Color agregado correctamente")
                if (onCreated && typeof onCreated === "function") onCreated(selectedColor, fantasyName)
                setOpen(false)
            } catch (error) {
                toast.dismiss()
                toast.error("Error al agregar el color")
            }
        })
    }

    const handleFantasyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFantasyName(e.target.value)
    }

    const handleDeleteColor = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
    }

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <div className="group flex flex-col gap-2">
                        <div className="relative flex items-center justify-center">
                            <div className="aspect-square rounded-sm size-16" style={{ backgroundColor: selectedColor }} />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="absolute w-full h-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                                        <IconButton icon={Trash} onClick={handleDeleteColor} />
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Eliminar color</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <p>{fantasyName}</p>
                    </div>
                </PopoverTrigger>
                <PopoverContent className="min-h-[300px]">
                    <ColorPicker onChange={handleColorChange} defaultValue={selectedColor}>
                        <ColorPickerSelection className="!min-h-[200px]" />
                        <div className="flex items-center gap-4">
                            <ColorPickerHue />
                        </div>
                        <div className="flex items-center gap-2">
                            <ColorPickerEyeDropper size="sm" />
                            <ColorPickerFormat className="text-accent" />
                        </div>
                        <Input
                            placeholder="Ej: Azul acero"
                            defaultValue={fantasyName}
                            onChange={handleFantasyNameChange}
                        />
                        <Button onClick={handleConfirm} disabled={isPending}>
                            {isPending ? <Loader2 className="animate-spin" /> : <CheckIcon />}
                            {isPending ? "Confirmando..." : "Confirmar"}
                        </Button>
                    </ColorPicker>
                </PopoverContent>
            </Popover>
        </div>
    )
}
export default ColorSelector
