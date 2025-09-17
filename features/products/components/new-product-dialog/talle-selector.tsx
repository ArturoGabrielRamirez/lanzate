import { Tags, TagsTrigger, TagsValue, TagsContent, TagsInput, TagsList, TagsEmpty, TagsGroup, TagsItem } from "@/src/components/ui/shadcn-io/tags"
import { Tag, CheckIcon, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useOptimistic, useState, useTransition } from "react"
import { createSizesDynamic } from "../../actions/createSizesDynamic"
import { toast } from "sonner"
import { getSizes } from "../../data/getSizes"
import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"

const TalleSelector = ({ storeId }: { storeId: number }) => {

    const { form } = useMultiStepForm<FormValues>()

    const [talleInput, setTalleInput] = useState<string>("")
    const [initialTalles, setInitialTalles] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedTalles, setSelectedTalles] = useState<string[]>([])
    const [optimisticSelectedTalles, setOptimisticSelectedTalles] = useOptimistic<string[]>(selectedTalles)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let mounted = true
        const load = async () => {
            setIsLoading(true)
            const localData = localStorage.getItem("create-product-new")
            if (localData) {
                const data = JSON.parse(localData)
                setSelectedTalles(data.sizes)
            }
            const { payload, error } = await getSizes({ store_id: storeId })
            if (error) return
            setIsLoading(false)
            if (!mounted) return
            setInitialTalles([...initialTalles, ...payload.map((talle: { label: string }) => talle.label)])
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const handleSelectTalle = (talle: string) => {
        const next = selectedTalles.includes(talle) ? selectedTalles.filter(v => v !== talle) : [...selectedTalles, talle]
        setSelectedTalles(prev => prev.includes(talle) ? prev.filter(v => v !== talle) : [...prev, talle])
        form.setValue('sizes', next, { shouldDirty: true })
    }

    const handleAddTalle = () => {
        startTransition(async () => {
            setOptimisticSelectedTalles([...optimisticSelectedTalles, talleInput])
            try {
                toast.loading("Agregando talle...")

                const { error, message } = await createSizesDynamic(talleInput, storeId)

                if (error) throw new Error(message)

                toast.dismiss()
                toast.success("Talle agregado correctamente")
                setSelectedTalles([...selectedTalles, talleInput])
                setInitialTalles([...initialTalles, talleInput])
                setTalleInput("")
            } catch (error) {
                toast.error("Error al agregar el talle")
            }
        })
    }

    const handleTalleInput = (talle: string) => {
        setTalleInput(talle)
    }

    const handleRemoveTalle = (talle: string) => {
        setSelectedTalles(prev => prev.filter(v => v !== talle))
        form.setValue('sizes', selectedTalles.filter(v => v !== talle), { shouldDirty: true })
    }

    return (
        <Tags>
            <TagsTrigger>
                {optimisticSelectedTalles.map((talle) => (
                    <TagsValue key={talle} onRemove={() => handleRemoveTalle(talle)}>
                        {talle}
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
                            <TagsItem key={talle} onSelect={() => handleSelectTalle(talle)}>
                                {talle}
                                {selectedTalles.includes(talle) && (
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