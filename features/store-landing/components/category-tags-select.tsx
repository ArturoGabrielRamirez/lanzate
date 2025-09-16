"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { CheckIcon, PlusIcon, Tag as TagIcon, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCategories } from "../actions/getCategories"
import { createCategoryDynamic } from "@/features/categories/actions/createCategoryDynamic"
import { toast } from "sonner"
import { Tags, TagsTrigger, TagsValue, TagsContent, TagsInput, TagsList, TagsEmpty, TagsGroup, TagsItem } from "@/src/components/ui/shadcn-io/tags"
import { AnimatePresence } from "motion/react"
import * as motion from "motion/react-client"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { FormMessage } from "@/components/ui/form"

type Option = { id: string; label: string }

export type CategoryTagsSelectProps = {
    storeId: number
    onChange?: (value: { label: string, value: string }[]) => void
    defaultValue?: { label: string, value: string }[]
    withLabel?: boolean
    className?: string
    options?: Option[]
    onOptionsChange?: (options: Option[]) => void
}

export default function CategoryTagsSelect({ storeId, withLabel = true, onChange, defaultValue, className, options, onOptionsChange }: CategoryTagsSelectProps) {

    const [tags, setTags] = useState<Option[]>(() => options || [])
    const [selected, setSelected] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [newTag, setNewTag] = useState<string>("")
    const lastEmittedKeyRef = useRef<string>("")

    // Seed from provided options immediately and keep in sync
    useEffect(() => {
        if (!options) return
        setTags(prev => {
            const sameLength = prev.length === options.length
            const same = sameLength && prev.every((p, i) => p.id === options[i]?.id && p.label === options[i]?.label)
            return same ? prev : options
        })
    }, [options])

    useEffect(() => {
        let mounted = true
        const load = async () => {
            try {
                setIsLoading(true)
                const { payload, error } = await getCategories(storeId)
                if (error) return
                if (!mounted) return
                const options: Option[] = (payload || []).map((c: { id: number; name: string }) => ({ id: String(c.id), label: c.name }))
                setTags(options)
                if (onOptionsChange) onOptionsChange(options)
            } finally {
                setIsLoading(false)
            }
        }
        if (storeId) load()
        return () => { mounted = false }
    }, [storeId])



    useEffect(() => {
        if (!defaultValue || defaultValue.length === 0) return
        const ids = defaultValue.map((d) => d.value)
        setSelected((prev) => {
            if (prev.length === ids.length && prev.every((v, i) => v === ids[i])) return prev
            return ids
        })
    }, [defaultValue])

    useEffect(() => {
        if (!onChange) return
        const key = selected.join('|')
        if (lastEmittedKeyRef.current === key) return
        lastEmittedKeyRef.current = key
        const output = selected.map((id) => ({
            value: id,
            label: tags.find((t) => t.id === id)?.label || id
        }))
        onChange(output)
    }, [selected, onChange, tags])

    const handleRemove = (value: string) => {
        if (!selected.includes(value)) return
        setSelected(prev => prev.filter(v => v !== value))
    }

    const handleSelect = (value: string) => {
        if (selected.includes(value)) { handleRemove(value); return }
        setSelected(prev => [...prev, value])
    }

    const handleCreateTag = async () => {
        const name = (newTag || "").trim()
        if (!name) return
        try {
            const { payload, error } = await createCategoryDynamic(storeId, name)
            if (error) { toast.error("Error creando categoría"); return }
            const opt: Option = { id: String(payload.id), label: payload.name }
            setTags(prev => [...prev, opt])
            setSelected(prev => [...prev, opt.id])
            setNewTag("")
            toast.success(`Categoría creada: ${payload.name}`)
        } catch {
            toast.error("Error creando categoría")
        }
    }

    const placeholder = useMemo(() => isLoading ? "Cargando categorías…" : "Buscar categoría…", [isLoading])

    return (
        <div className={cn("flex flex-col gap-1 w-full", className)}>
            {withLabel && (
                <Label htmlFor="category-tags" className="text-muted-foreground/50">
                    Categorías
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="size-4 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="space-y-1">
                            <p>Las categorías del producto. Se pueden crear nuevas categorías.</p>
                            <p>Ej: Bebida, Gaseosa, Energética</p>
                            <FormMessage className="text-foreground text-xs" />
                        </TooltipContent>
                    </Tooltip>
                </Label>
            )}
            <Tags className="">
                <TagsTrigger className="!bg-transparent">
                    <AnimatePresence>
                        {selected.map((tag) => (
                            <motion.div
                                key={tag}
                                initial={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                                exit={{ y: 20, opacity: 0, filter: "blur(4px)" }}
                                transition={{ duration: 0.3, bounce: 0, type: "spring" }}
                            >
                                <TagsValue key={tag} onRemove={() => { handleRemove(tag) }}>
                                    {tags.find((t) => t.id === tag)?.label}
                                </TagsValue>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {selected.length === 0 && (
                        <span className="flex items-center gap-2 px-2 py-px text-muted-foreground">
                            <TagIcon size={14} />
                            Selecciona una categoría…
                        </span>
                    )}
                </TagsTrigger>
                <TagsContent>
                    <TagsInput onValueChange={setNewTag} placeholder={placeholder} />
                    <TagsList>
                        <TagsEmpty>
                            <button
                                className="mx-auto flex cursor-pointer items-center gap-2"
                                onClick={handleCreateTag}
                                type="button"
                            >
                                <PlusIcon className="text-muted-foreground" size={14} />
                                Crear categoría: {newTag}
                            </button>
                        </TagsEmpty>
                        <TagsGroup>
                            {tags.map((tag) => (
                                <TagsItem key={tag.id} onSelect={handleSelect} value={tag.id}>
                                    {tag.label}
                                    {selected.includes(tag.id) && (
                                        <CheckIcon className="text-muted-foreground" size={14} />
                                    )}
                                </TagsItem>
                            ))}
                        </TagsGroup>
                    </TagsList>
                </TagsContent>
            </Tags>
        </div>
    )
}


