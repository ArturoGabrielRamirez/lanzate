import { Tags, TagsTrigger, TagsValue, TagsContent, TagsInput, TagsList, TagsEmpty, TagsGroup, TagsItem } from "@/src/components/ui/shadcn-io/tags"
import { Tag, CheckIcon, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useOptimistic, useState, useTransition } from "react"
import { createFlavorDynamic } from "../../actions/createFlavorDynamic"
import { toast } from "sonner"
import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { getFlavors } from "../../data/getFlavors"

const FlavorSelector = ({ storeId }: { storeId: number }) => {

    const { form } = useMultiStepForm<FormValues>()

    const [flavorInput, setFlavorInput] = useState<string>("")
    const [initialFlavors, setInitialFlavors] = useState<{ id: number; label: string }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedFlavors, setSelectedFlavors] = useState<{ id: number; label: string }[]>([])
    const [optimisticSelectedFlavors, setOptimisticSelectedFlavors] = useOptimistic<{ id: number; label: string }[]>(selectedFlavors)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let mounted = true
        const load = async () => {
            setIsLoading(true)
            const localData = localStorage.getItem("create-product-new")
            if (localData) {
                const data = JSON.parse(localData)
                setSelectedFlavors(data.flavors)
            }
            const { payload, error } = await getFlavors({ store_id: storeId })
            if (error) return
            setIsLoading(false)
            if (!mounted) return
            setInitialFlavors([...initialFlavors, ...payload])
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const handleSelectFlavor = (flavor: { id: number; label: string }) => {
        const next = selectedFlavors.some(v => v.id === flavor.id) ? selectedFlavors.filter(v => v.id !== flavor.id) : [...selectedFlavors, flavor]
        setSelectedFlavors(prev => prev.some(v => v.id === flavor.id) ? prev.filter(v => v.id !== flavor.id) : [...prev, flavor])
        form.setValue('flavors', next, { shouldDirty: true })
    }

    const handleAddFlavor = () => {
        startTransition(async () => {
            setOptimisticSelectedFlavors([...optimisticSelectedFlavors, { id: -1, label: flavorInput }])
            try {
                toast.loading("Agregando sabor...")

                const { error, message, payload } = await createFlavorDynamic(flavorInput, storeId)

                if (error) throw new Error(message)

                toast.dismiss()
                toast.success("Sabor agregado correctamente")
                setSelectedFlavors([...selectedFlavors, { id: payload.id, label: payload.label }])
                setInitialFlavors([...initialFlavors, { id: payload.id, label: payload.label }])
                setFlavorInput("")
            } catch (error) {
                console.log(error)
                toast.error("Error al agregar el sabor")
            }
        })
    }

    const handleFlavorInput = (flavor: string) => {
        setFlavorInput(flavor)
    }

    const handleRemoveFlavor = (flavor: { id: number; label: string }) => {
        setSelectedFlavors(prev => prev.filter(v => v.id !== flavor.id))
        form.setValue('flavors', selectedFlavors.filter(v => v.id !== flavor.id), { shouldDirty: true })
    }

    return (
        <Tags>
            <TagsTrigger>
                {optimisticSelectedFlavors.map((flavor) => (
                    <TagsValue key={flavor.id} onRemove={() => handleRemoveFlavor(flavor)}>
                        {flavor.label}
                    </TagsValue>
                ))}
                {optimisticSelectedFlavors.length === 0 && (
                    <TagsValue>
                        <span className="flex items-center gap-2 px-2 py-px">
                            <Tag />
                            Selecciona opciones…
                        </span>
                    </TagsValue>
                )}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Selecciona opciones…" onValueChange={handleFlavorInput} value={flavorInput} />
                <TagsList>
                    <TagsEmpty>
                        <Button variant="outline" size="sm" onClick={handleAddFlavor} disabled={isPending}>
                            {isPending && <Loader className="size-4 animate-spin" />}
                            {isPending ? "Agregando sabor..." : "Agregar sabor"}
                        </Button>
                    </TagsEmpty>
                    <TagsGroup>
                        {isLoading && (
                            <TagsItem>
                                <Loader className="size-4 animate-spin" />
                            </TagsItem>
                        )}
                        {initialFlavors.map((flavor) => (
                            <TagsItem key={flavor.id} onSelect={() => handleSelectFlavor(flavor)}>
                                {flavor.label}
                                {selectedFlavors.some(v => v.id === flavor.id) && (
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
export default FlavorSelector