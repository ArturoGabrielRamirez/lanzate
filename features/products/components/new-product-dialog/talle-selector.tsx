import { Tags, TagsTrigger, TagsValue, TagsContent, TagsInput, TagsList, TagsEmpty, TagsGroup, TagsItem } from "@/src/components/ui/shadcn-io/tags"
import { Tag, CheckIcon, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useOptimistic, useState, useTransition } from "react"
import { createSizesDynamic } from "../../actions/createSizesDynamic"
import { toast } from "sonner"
import { getSizes } from "../../data/getSizes"
import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"

type SizeOption = {
    id: number
    label: string
}

const TalleSelector = ({ storeId }: { storeId: number }) => {

    const { form } = useMultiStepForm<FormValues>()

    const [talleInput, setTalleInput] = useState<string>("")
    const [initialTalles, setInitialTalles] = useState<SizeOption[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedTalles, setSelectedTalles] = useState<SizeOption[]>([])
    const [optimisticSelectedTalles, setOptimisticSelectedTalles] = useOptimistic<SizeOption[]>(selectedTalles)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let mounted = true
        const load = async () => {
            setIsLoading(true)
            const localData = localStorage.getItem("create-product-new")
            if (localData) {
                const data = JSON.parse(localData)
                if (data.sizes && Array.isArray(data.sizes)) {
                    setSelectedTalles(data.sizes)
                }
            }
            const { payload, error } = await getSizes({ store_id: storeId })
            console.log("🚀 ~ load ~ payload:", payload)
            
            if (error) return
            setIsLoading(false)
            if (!mounted) return
            setInitialTalles(payload)
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const handleSelectTalle = (talle: SizeOption) => {
        const isSelected = selectedTalles.some(selected => selected.id === talle.id)
        const next = isSelected 
            ? selectedTalles.filter(selected => selected.id !== talle.id)
            : [...selectedTalles, talle]
        
        setSelectedTalles(next)
        form.setValue('sizes', next, { shouldDirty: true })
    }

    const handleAddTalle = () => {
        startTransition(async () => {
            // Crear un talle temporal para el estado optimista
            const tempTalle: SizeOption = {
                id: -1, // ID temporal
                label: talleInput
            }
            setOptimisticSelectedTalles([...optimisticSelectedTalles, tempTalle])
            
            try {
                toast.loading("Agregando talle...")

                const { error, message, payload } = await createSizesDynamic(talleInput, storeId)

                if (error) throw new Error(message)

                toast.dismiss()
                toast.success("Talle agregado correctamente")
                
                // Usar el talle real devuelto por la API
                const newTalle: SizeOption = {
                    id: payload.id,
                    label: payload.label
                }
                
                setSelectedTalles([...selectedTalles, newTalle])
                setInitialTalles([...initialTalles, newTalle])
                setTalleInput("")
            } catch (error) {
                toast.error("Error al agregar el talle")
            }
        })
    }

    const handleTalleInput = (talle: string) => {
        setTalleInput(talle)
    }

    const handleRemoveTalle = (talle: SizeOption) => {
        const next = selectedTalles.filter(selected => selected.id !== talle.id)
        setSelectedTalles(next)
        form.setValue('sizes', next, { shouldDirty: true })
    }

    return (
        <Tags>
            <TagsTrigger>
                {optimisticSelectedTalles.map((talle) => (
                    <TagsValue key={talle.id} onRemove={() => handleRemoveTalle(talle)}>
                        {talle.label}
                    </TagsValue>
                ))}
                {optimisticSelectedTalles.length === 0 && (
                    <TagsValue>
                        <span className="flex items-center gap-2 px-2 py-px">
                            <Tag />
                            Selecciona opciones…
                        </span>
                    </TagsValue>
                )}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Selecciona opciones…" onValueChange={handleTalleInput} value={talleInput} />
                <TagsList>
                    <TagsEmpty>
                        <Button variant="outline" size="sm" onClick={handleAddTalle} disabled={isPending}>
                            {isPending && <Loader className="size-4 animate-spin" />}
                            {isPending ? "Agregando talle..." : "Agregar talle"}
                        </Button>
                    </TagsEmpty>
                    <TagsGroup>
                        {isLoading && (
                            <TagsItem>
                                <Loader className="size-4 animate-spin" />
                            </TagsItem>
                        )}
                        {initialTalles.map((talle) => (
                            <TagsItem key={talle.id} onSelect={() => handleSelectTalle(talle)}>
                                {talle.label}
                                {selectedTalles.some(selected => selected.id === talle.id) && (
                                    <CheckIcon className="text-muted-foreground" />
                                )}
                            </TagsItem>
                        ))}
                    </TagsGroup>
                </TagsList>
            </TagsContent>
        </Tags>
    )
}
export default TalleSelector