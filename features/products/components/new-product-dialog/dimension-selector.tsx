import { Tags, TagsTrigger, TagsValue, TagsContent, TagsInput, TagsList, TagsEmpty, TagsGroup, TagsItem } from "@/src/components/ui/shadcn-io/tags"
import { Tag, CheckIcon, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useOptimistic, useState, useTransition } from "react"
import { toast } from "sonner"
import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { getDimensions } from "../../data/getDimensions"
import { createDimensionsDynamic } from "../../actions/createDimensionsDynamic"

type DimensionOption = {
    id: number
    label: string
}

const DimensionSelector = ({ storeId }: { storeId: number }) => {

    const { form } = useMultiStepForm<FormValues>()

    const [dimensionInput, setDimensionInput] = useState<string>("")
    const [initialDimensions, setInitialDimensions] = useState<DimensionOption[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedDimensions, setSelectedDimensions] = useState<DimensionOption[]>([])
    const [optimisticSelectedDimensions, setOptimisticSelectedDimensions] = useOptimistic<DimensionOption[]>(selectedDimensions)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let mounted = true
        const load = async () => {
            setIsLoading(true)
            const localData = localStorage.getItem("create-product-new")
            if (localData) {
                const data = JSON.parse(localData)
                setSelectedDimensions(data.dimensions)
            }
            const { payload, error } = await getDimensions({ store_id: storeId })
            if (error) return
            setIsLoading(false)
            if (!mounted) return
            setInitialDimensions(payload)
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const handleSelectDimension = (dimension: DimensionOption) => {
        const next = selectedDimensions.some(v => v.id === dimension.id) ? selectedDimensions.filter(v => v.id !== dimension.id) : [...selectedDimensions, dimension]
        setSelectedDimensions(prev => prev.includes(dimension) ? prev.filter(v => v !== dimension) : [...prev, dimension])
        form.setValue('dimensions', next, { shouldDirty: true })
    }

    const handleAddDimension = () => {
        startTransition(async () => {
            setOptimisticSelectedDimensions([...optimisticSelectedDimensions, { id: -1, label: dimensionInput } as DimensionOption])
            try {
                toast.loading("Agregando dimensión...")

                const { error, message, payload } = await createDimensionsDynamic(dimensionInput, storeId)

                if (error) throw new Error(message)

                toast.dismiss()
                toast.success("Talle agregado correctamente")
                setSelectedDimensions([...selectedDimensions, { id: payload.id, label: payload.label }])
                setInitialDimensions([...initialDimensions, { id: payload.id, label: payload.label }])
                setDimensionInput("")
            } catch (error) {
                toast.error("Error al agregar la dimensión")
            }
        })
    }

    const handleDimensionInput = (dimension: string) => {
        setDimensionInput(dimension)
    }

    const handleRemoveDimension = (dimension: DimensionOption) => {
        setSelectedDimensions(prev => prev.filter(v => v !== dimension))
        form.setValue('dimensions', selectedDimensions.filter(v => v.id !== dimension.id), { shouldDirty: true })
    }

    return (
        <Tags>
            <TagsTrigger>
                {optimisticSelectedDimensions.map((dimension) => (
                    <TagsValue key={dimension.id} onRemove={() => handleRemoveDimension(dimension)}>
                        {dimension.label}
                    </TagsValue>
                ))}
                {optimisticSelectedDimensions.length === 0 && (
                    <TagsValue>
                        <span className="flex items-center gap-2 px-2 py-px">
                            <Tag />
                            Selecciona opciones…
                        </span>
                    </TagsValue>
                )}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Selecciona opciones…" onValueChange={handleDimensionInput} value={dimensionInput} />
                <TagsList>
                    <TagsEmpty>
                        <Button variant="outline" size="sm" onClick={handleAddDimension} disabled={isPending}>
                            {isPending && <Loader className="size-4 animate-spin" />}
                            {isPending ? "Agregando dimensión..." : "Agregar dimensión"}
                        </Button>
                    </TagsEmpty>
                    <TagsGroup>
                        {isLoading && (
                            <TagsItem>
                                <Loader className="size-4 animate-spin" />
                            </TagsItem>
                        )}
                        {initialDimensions.map((dimension) => (
                            <TagsItem key={dimension.id} onSelect={() => handleSelectDimension(dimension)}>
                                {dimension.label}
                                {selectedDimensions.some(selected => selected.id === dimension.id) && (
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
export default DimensionSelector