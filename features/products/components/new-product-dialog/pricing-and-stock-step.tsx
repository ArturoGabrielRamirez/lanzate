import { useMultiStepForm } from "@/components/multi-step-form-wrapper"
import { FormValues } from "./validation-schemas"
import * as motion from "motion/react-client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Info, DollarSign } from "lucide-react"
import { TooltipContent } from "@/components/ui/tooltip"
import { Package, Hash, Barcode, Check, Crown, Eye } from "lucide-react"
import { Switch } from "@/components/ui/switch"

function PricingAndStockStep() {
    const { form } = useMultiStepForm<FormValues>()

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
        >
            <Form {...form}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex text-muted-foreground/50">
                                    Price <span className="text-red-500">*</span>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="size-4 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>El precio del producto</p>
                                            <p>Ej: 1999</p>
                                            <FormMessage className="text-foreground text-xs" />
                                        </TooltipContent>
                                    </Tooltip>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        placeholder="Ej: $1999"
                                        inputMode="numeric"
                                        startContent={<DollarSign />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="stock"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel className="flex text-muted-foreground/50">
                                        Stock <span className="text-red-500">*</span>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="size-4 cursor-pointer" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>El stock del producto</p>
                                                <p>Ej: 10</p>
                                                <FormMessage className="text-foreground text-xs" />
                                            </TooltipContent>
                                        </Tooltip>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            placeholder="Ej: 10"
                                            inputMode="numeric"
                                            startContent={<Package />}
                                        />
                                    </FormControl>
                                </FormItem>
                            )
                        }}
                    />

                    <FormField
                        control={form.control}
                        name="sku"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex text-muted-foreground/50">
                                    SKU
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="size-4 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>El SKU del producto</p>
                                            <p>Ej: SKU-123</p>
                                            <FormMessage className="text-foreground text-xs" />
                                        </TooltipContent>
                                    </Tooltip>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Ej: SKU-123"
                                        startContent={<Hash />}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="barcode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex text-muted-foreground/50">
                                    Barcode
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Info className="size-4 cursor-pointer" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>El código de barras del producto</p>
                                            <p>Ej: 1234567890</p>
                                            <FormMessage className="text-foreground text-xs" />
                                        </TooltipContent>
                                    </Tooltip>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        {...field}
                                        placeholder="Ej: 1234567890"
                                        startContent={<Barcode />}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>
                <div className="mt-8 space-y-4">
                    <FormField
                        control={form.control}
                        name="is_published"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Eye className="size-6 text-muted-foreground/50" />
                                        <div>
                                            <FormLabel>Producto publicado</FormLabel>
                                            <FormDescription>
                                                Visible en tu tienda pública
                                            </FormDescription>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id="is-published"
                                            name="is_published"
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="is_active"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Check className="size-6 text-muted-foreground/50" />
                                        <div>
                                            <FormLabel>Producto activo</FormLabel>
                                            <FormDescription>
                                                Hazlo disponible para la venta
                                            </FormDescription>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id="is-active"
                                            name="is_active"
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="is_featured"
                        render={({ field }) => {
                            return (
                                <FormItem className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Crown className="size-6 text-muted-foreground/50" />
                                        <div>
                                            <FormLabel>Producto destacado</FormLabel>
                                            <FormDescription>
                                                Resáltalo en secciones especiales
                                            </FormDescription>
                                        </div>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            id="is-featured"
                                            name="is_featured"
                                            checked={field.value ?? false}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                </div>
            </Form>
        </motion.div >
    )
}

export default PricingAndStockStep