import { Tags, TagsTrigger, TagsValue, TagsContent, TagsInput, TagsList, TagsEmpty, TagsGroup, TagsItem } from "@/src/components/ui/shadcn-io/tags"
import { Tag, CheckIcon, Loader } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useOptimistic, useState, useTransition } from "react"
import { toast } from "sonner"
import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { getFragrances } from "../../data/getFragrances"
import { createFragranceDynamic } from "../../actions/createFragranceDynamic"

const FraganceSelector = ({ storeId }: { storeId: number }) => {

    const { form } = useMultiStepForm<FormValues>()

    const [fraganceInput, setFraganceInput] = useState<string>("")
    const [initialFragances, setInitialFragances] = useState<{ id: number; label: string }[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [selectedFragances, setSelectedFragances] = useState<{ id: number; label: string }[]>([])
    const [optimisticSelectedFragances, setOptimisticSelectedFragances] = useOptimistic<{ id: number; label: string }[]>(selectedFragances)
    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        let mounted = true
        const load = async () => {
            setIsLoading(true)
            const localData = localStorage.getItem("create-product-new")
            if (localData) {
                const data = JSON.parse(localData)
                setSelectedFragances(data.fragrances)
            }
            const { payload, error } = await getFragrances({ store_id: storeId })
            if (error) return
            setIsLoading(false)
            if (!mounted) return
            setInitialFragances([...initialFragances, ...payload])
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const handleSelectFragance = (fragance: { id: number; label: string }) => {
        const next = selectedFragances.some(v => v.id === fragance.id) ? selectedFragances.filter(v => v.id !== fragance.id) : [...selectedFragances, fragance]
        setSelectedFragances(prev => prev.some(v => v.id === fragance.id) ? prev.filter(v => v.id !== fragance.id) : [...prev, fragance])
        form.setValue('fragrances', next, { shouldDirty: true })
    }

    const handleAddFragance = () => {
        startTransition(async () => {
            setOptimisticSelectedFragances([...optimisticSelectedFragances, { id: -1, label: fraganceInput }])
            try {
                toast.loading("Agregando fragancia...")

                const { error, message, payload } = await createFragranceDynamic(fraganceInput, storeId)

                if (error) throw new Error(message)

                toast.dismiss()
                toast.success("Fragancia agregada correctamente")
                setSelectedFragances([...selectedFragances, { id: payload.id, label: payload.label }])
                setInitialFragances([...initialFragances, { id: payload.id, label: payload.label }])
                setFraganceInput("")
            } catch (error) {
                console.log(error)
                toast.error("Error al agregar la fragancia")
            }
        })
    }

    const handleFraganceInput = (fragance: string) => {
        setFraganceInput(fragance)
    }

    const handleRemoveFragance = (fragance: { id: number; label: string }) => {
        setSelectedFragances(prev => prev.filter(v => v.id !== fragance.id))
        form.setValue('fragrances', selectedFragances.filter(v => v.id !== fragance.id), { shouldDirty: true })
    }

    return (
        <Tags>
            <TagsTrigger>
                {optimisticSelectedFragances.map((fragance) => (
                    <TagsValue key={fragance.id} onRemove={() => handleRemoveFragance(fragance)}>
                        {fragance.label}
                    </TagsValue>
                ))}
                {optimisticSelectedFragances.length === 0 && (
                    <TagsValue>
                        <span className="flex items-center gap-2 px-2 py-px">
                            <Tag />
                            Selecciona opciones…
                        </span>
                    </TagsValue>
                )}
            </TagsTrigger>
            <TagsContent>
                <TagsInput placeholder="Selecciona opciones…" onValueChange={handleFraganceInput} value={fraganceInput} />
                <TagsList>
                    <TagsEmpty>
                        <Button variant="outline" size="sm" onClick={handleAddFragance} disabled={isPending}>
                            {isPending && <Loader className="size-4 animate-spin" />}
                            {isPending ? "Agregando fragancia..." : "Agregar fragancia"}
                        </Button>
                    </TagsEmpty>
                    <TagsGroup>
                        {isLoading && (
                            <TagsItem>
                                <Loader className="size-4 animate-spin" />
                            </TagsItem>
                        )}
                        {initialFragances.map((fragance) => (
                            <TagsItem key={fragance.id} onSelect={() => handleSelectFragance(fragance)}>
                                {fragance.label}
                                {selectedFragances.some(v => v.id === fragance.id) && (
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
export default FraganceSelector