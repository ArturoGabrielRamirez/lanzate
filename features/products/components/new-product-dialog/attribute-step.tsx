import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import { useState, useEffect } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Calendar, Info, RotateCw, Weight } from "lucide-react"
import * as motion from "motion/react-client"
import AnimatedTags from "@/src/components/smoothui/ui/AnimatedTags"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { AnimatePresence } from "motion/react"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import TalleSelector from "./talle-selector"

function AttributesStep({ storeId }: { storeId: number }) {

    const { form } = useMultiStepForm<FormValues>()
    console.log("🚀 ~ AttributesStep ~ form:", form.formState.errors)
    const [selected, setSelected] = useState<string[]>([])
    const [accordions, setAccordions] = useState({
        content: false,
        dimensions: false,
        sizes: false,
        surface: false,
        sensorial: false,
    })

    const categories = {
        "content": {
            attributes: ["Peso", "Fecha de vencimiento"],
            title: "Contenido y vencimiento",
        },
        "dimensions": {
            attributes: ["Alto", "Ancho", "Profundidad", "Circumferencia"],
            title: "Dimensiones",
        },
        "sizes": {
            attributes: ["Talle", "Tamaño"],
            title: "Talles y tamaños",
        },
        "surface": {
            attributes: ["Color", "Material"],
            title: "Superficie",
        },
        "sensorial": {
            attributes: ["Sabor", "Fragancia"],
            title: "Aromas y sabores",
        },
    }

    const categoriesArray = Object.values(categories)
    const initialTags = categoriesArray.flatMap(category => category.attributes)

    useEffect(() => {
        const localData = localStorage.getItem('create-product-new')
        if (localData) {
            const data = JSON.parse(localData)
            setSelected(data.selected_attributes)
            setAccordions({
                content: data.selected_attributes.includes("Peso") || data.selected_attributes.includes("Fecha de vencimiento"),
                dimensions: data.selected_attributes.includes("Alto") || data.selected_attributes.includes("Ancho") || data.selected_attributes.includes("Largo") || data.selected_attributes.includes("Profundidad") || data.selected_attributes.includes("Circumferencia"),
                sizes: data.selected_attributes.includes("Talle") || data.selected_attributes.includes("Tamaño"),
                surface: data.selected_attributes.includes("Color") || data.selected_attributes.includes("Material"),
                sensorial: data.selected_attributes.includes("Sabor") || data.selected_attributes.includes("Fragancia"),
            })
        }
    }, [])

    const handleAttributeChange = (vals: string[]) => {
        setSelected(vals)
        setAccordions({
            content: vals.includes("Peso") || vals.includes("Fecha de vencimiento"),
            dimensions: vals.includes("Alto") || vals.includes("Ancho") || vals.includes("Largo") || vals.includes("Profundidad") || vals.includes("Circumferencia"),
            sizes: vals.includes("Talle") || vals.includes("Tamaño"),
            surface: vals.includes("Color") || vals.includes("Material"),
            sensorial: vals.includes("Sabor") || vals.includes("Fragancia"),
        })
        form.setValue('selected_attributes', vals)
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                <AnimatedTags
                    title={""}
                    emptyMessage="Tu producto no tiene atributos aun. Haz click en alguno para agregarlo."
                    initialTags={initialTags}
                    onChange={handleAttributeChange}
                    selectedTags={selected}
                />
                <Accordion type="single" collapsible>
                    {accordions.content && (
                        <AccordionItem value="content">
                            <AccordionTrigger className={cn(
                                (form.formState.errors.weight || form.formState.errors.expiration_date) && "text-red-500"
                            )}>
                                <span>Contenido y vencimiento</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={cn(
                                    "grid grid-cols-1 md:grid-cols-2 gap-4",
                                    selected.includes("Peso") && selected.includes("Fecha de vencimiento") ? "md:grid-cols-2" : "md:grid-cols-1"
                                )}>
                                    <AnimatePresence>
                                        {selected.includes("Peso") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                className="flex items-end w-full"
                                                key="weight"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="weight"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">
                                                                Peso <span className="text-red-500">*</span>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="size-4 cursor-pointer" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>El peso del producto</p>
                                                                        <p>Ej: 1000</p>
                                                                        <FormMessage className="text-foreground text-xs" />
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej: 1000"
                                                                    inputMode="numeric"
                                                                    startContent={<Weight />}
                                                                    className="rounded-r-none h-10"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="weight_unit"
                                                    render={({ field }) => {
                                                        return (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Select value={field.value} onValueChange={field.onChange}>
                                                                        <SelectTrigger className="rounded-l-none !h-[40px]">
                                                                            <SelectValue placeholder="KG" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="kg">KG</SelectItem>
                                                                            <SelectItem value="g">G</SelectItem>
                                                                            <SelectItem value="mg">MG</SelectItem>
                                                                            <SelectItem value="oz">OZ</SelectItem>
                                                                            <SelectItem value="lb">LB</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )
                                                    }}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Fecha de vencimiento") && (
                                            <motion.div
                                                className="flex items-end w-full"
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="expiration_date"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="expiration_date"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">
                                                                Fecha de vencimiento <span className="text-red-500">*</span>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="size-4 cursor-pointer" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>La fecha de vencimiento del producto</p>
                                                                        <p>Ej: 2026-12-31</p>
                                                                        <FormMessage className="text-foreground text-xs" />
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="date"
                                                                    {...field}
                                                                    placeholder="Enter your expiration date"
                                                                    startContent={<Calendar />}
                                                                    className="w-full"
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.dimensions && (
                        <AccordionItem value="dimensions">
                            <AccordionTrigger className={cn(
                                (form.formState.errors.height || form.formState.errors.width || form.formState.errors.depth || form.formState.errors.circumference) && "text-red-500"
                            )}>
                                <span>Dimensiones</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className={cn(
                                    "grid grid-cols-1 md:grid-cols-2 gap-4",
                                )}>
                                    <AnimatePresence>
                                        {selected.includes("Alto") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="height"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="height"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">
                                                                Alto <span className="text-red-500">*</span>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="size-4 cursor-pointer" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>La altura del producto</p>
                                                                        <p>Ej: 2Mts</p>
                                                                        <FormMessage className="text-foreground text-xs" />
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    className="rounded-r-none h-10"
                                                                    startContent={(
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                                            <path fill="currentColor" d="M17.207 3.293a1 1 0 0 0-1.414 0l-2.5 2.5a1 1 0 0 0 1.414 1.414L16.5 5.414l1.793 1.793a1 1 0 1 0 1.414-1.414zm-10.707.7a2.5 2.5 0 0 0-2.5 2.5v11a2.5 2.5 0 0 0 2.5 2.5h4a1 1 0 1 0 0-2h-4a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h4a1 1 0 1 0 0-2zm10.707 16.714l2.5-2.5a1 1 0 0 0-1.414-1.414L16.5 18.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0M17.5 12a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-1 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1m0-7a1 1 0 0 0-1 1v1a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1" />
                                                                        </svg>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="height_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger className="rounded-l-none !h-[40px]">
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Ancho") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="width"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="width"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">
                                                                Ancho <span className="text-red-500">*</span>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="size-4 cursor-pointer" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>El ancho del producto</p>
                                                                        <p>Ej: 2Mts</p>
                                                                        <FormMessage className="text-foreground text-xs" />
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    className="rounded-r-none h-10"
                                                                    startContent={(
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                                                            <path fill="currentColor" d="M20.008 6.5a2.5 2.5 0 0 0-2.5-2.5h-11a2.5 2.5 0 0 0-2.5 2.5v4a1 1 0 1 0 2 0v-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v4a1 1 0 1 0 2 0zm-1.8 13.207l2.5-2.5a1 1 0 0 0 0-1.414l-2.5-2.5a1 1 0 0 0-1.415 1.414l1.793 1.793l-1.793 1.793a1 1 0 0 0 1.414 1.414M3.292 15.793a1 1 0 0 0 0 1.414l2.5 2.5a1 1 0 0 0 1.414-1.414L5.414 16.5l1.793-1.793a1 1 0 1 0-1.414-1.414zM13 16.5a1 1 0 1 0-2 0a1 1 0 0 0 2 0m-4-1a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm8 1a1 1 0 0 0-1-1h-1a1 1 0 1 0 0 2h1a1 1 0 0 0 1-1" />
                                                                        </svg>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="width_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger className="rounded-l-none !h-[40px]">
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Profundidad") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="depth"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="depth"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">
                                                                Profundidad <span className="text-red-500">*</span>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="size-4 cursor-pointer" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>La profundidad del producto</p>
                                                                        <p>Ej: 2Mts</p>
                                                                        <FormMessage className="text-foreground text-xs" />
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    className="rounded-r-none h-10"
                                                                    startContent={(
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                                                            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2 20h20M5 4h14M3 16.01l.01-.011m18 .011l-.01-.011M4 12.01l.01-.011m16 .011l-.01-.011M5 8.01l.01-.011m14 .011L19 7.999M12 7v10m0-10l-1.5 1.5M12 7l1.5 1.5M12 17l-3-3m3 3l3-3" />
                                                                        </svg>
                                                                    )}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="depth_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger className="rounded-l-none !h-[40px]">
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                        {selected.includes("Circumferencia") && (
                                            <motion.div
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, y: 50, position: 'absolute' }}
                                                key="circumference"
                                                className="flex items-end w-full"
                                            >
                                                <FormField
                                                    control={form.control}
                                                    name="circumference"
                                                    render={({ field }) => (
                                                        <FormItem className="w-full">
                                                            <FormLabel className="text-muted-foreground/50">
                                                                Circumferencia <span className="text-red-500">*</span>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Info className="size-4 cursor-pointer" />
                                                                    </TooltipTrigger>
                                                                    <TooltipContent>
                                                                        <p>La circunferencia del producto</p>
                                                                        <p>Ej: 2Mts</p>
                                                                        <FormMessage className="text-foreground text-xs" />
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    {...field}
                                                                    placeholder="Ej. 2Mts"
                                                                    inputMode="numeric"
                                                                    className="rounded-r-none h-10"
                                                                    startContent={<RotateCw />}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="circumference_unit"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Select value={field.value} onValueChange={field.onChange}>
                                                                    <SelectTrigger className="rounded-l-none !h-[40px]">
                                                                        <SelectValue placeholder="CM" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="cm">CM</SelectItem>
                                                                        <SelectItem value="m">M</SelectItem>
                                                                        <SelectItem value="in">IN</SelectItem>
                                                                        <SelectItem value="ft">FT</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.sizes && (
                        <AccordionItem value="sizes">
                            <AccordionTrigger className={cn(
                                (form.formState.errors.sizes) && "text-red-500"
                            )}>
                                <span>Talles y tamaños</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <TalleSelector storeId={storeId} />
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.surface && (
                        <AccordionItem value="surface">
                            <AccordionTrigger className={cn(
                                (form.formState.errors.colors || form.formState.errors.material) && "text-red-500"
                            )}>
                                <span>Superficie</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <h3>Superficie</h3>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                    {accordions.sensorial && (
                        <AccordionItem value="sensorial">
                            <AccordionTrigger className={cn(
                                (form.formState.errors.flavors || form.formState.errors.fragrances) && "text-red-500"
                            )}>
                                <span>Aromas y sabores</span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div>
                                    <h3>Aromas y sabores</h3>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </Form>
        </motion.div>
    )
}

export default AttributesStep