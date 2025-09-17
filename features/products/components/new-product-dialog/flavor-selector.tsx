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
    const [initialFlavors, setInitialFlavors] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
    const [optimisticSelectedFlavors, setOptimisticSelectedFlavors] = useOptimistic<string[]>(selectedFlavors)
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
            setInitialFlavors([...initialFlavors, ...payload.map((flavor: { label: string }) => flavor.label)])
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const handleSelectFlavor = (flavor: string) => {
        const next = selectedFlavors.includes(flavor) ? selectedFlavors.filter(v => v !== flavor) : [...selectedFlavors, flavor]
        setSelectedFlavors(prev => prev.includes(flavor) ? prev.filter(v => v !== flavor) : [...prev, flavor])
        form.setValue('flavors', next, { shouldDirty: true })
    }

    const handleAddFlavor = () => {
        startTransition(async () => {
            setOptimisticSelectedFlavors([...optimisticSelectedFlavors, flavorInput])
            try {
                toast.loading("Agregando sabor...")

                const { error, message } = await createFlavorDynamic(flavorInput, storeId)

                if (error) throw new Error(message)

                toast.dismiss()
                toast.success("Sabor agregado correctamente")
                setSelectedFlavors([...selectedFlavors, flavorInput])
                setInitialFlavors([...initialFlavors, flavorInput])
                setFlavorInput("")
            } catch (error) {
                toast.error("Error al agregar el sabor")
            }
        })
    }

    const handleFlavorInput = (flavor: string) => {
        setFlavorInput(flavor)
    }

    const handleRemoveFlavor = (flavor: string) => {
        setSelectedFlavors(prev => prev.filter(v => v !== flavor))
        form.setValue('flavors', selectedFlavors.filter(v => v !== flavor), { shouldDirty: true })
    }

    return (
        <Tags>
            <TagsTrigger>
                {optimisticSelectedFlavors.map((flavor) => (
                    <TagsValue key={flavor} onRemove={() => handleRemoveFlavor(flavor)}>
                        {flavor}
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
                            <TagsItem key={flavor} onSelect={() => handleSelectFlavor(flavor)}>
                                {flavor}
                                {selectedFlavors.includes(flavor) && (
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