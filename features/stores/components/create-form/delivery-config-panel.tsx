import { Plus, Store, Truck, Trash } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { FieldErrors } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { ShippingMethodFormPanel } from "@/features/stores/components/create-form/shipping-method-form-panel"
import { CreateStoreFormValues, ShippingMethod } from "@/features/stores/types"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

interface DeliveryConfigPanelProps {
    offersDelivery: boolean
    onSelectionChange: (selection: Selection) => void
    isAddingMethod: boolean
    shippingMethods: ShippingMethod[]
    errors: FieldErrors<CreateStoreFormValues>
    onAddMethod: () => void

    // Props for commented out functionality
    editingIndex?: number | null
    onCancelMethod?: (index: number) => void
    onSaveMethod?: (index: number, method: ShippingMethod) => void
    onDeleteMethod?: (index: number) => void
}

export function DeliveryConfigPanel({
    offersDelivery,
    onSelectionChange,
    isAddingMethod,
    shippingMethods,
    errors,
    onAddMethod,
    editingIndex,
    onCancelMethod,
    onSaveMethod,
    onDeleteMethod
}: DeliveryConfigPanelProps) {
    return (
        <div className="flex flex-col gap-4">
            <ChoiceBox
                columns={2}
                gap={6}
                selectionMode="single"
                selectedKeys={[offersDelivery ? "delivery" : "pickup"]}
                onSelectionChange={onSelectionChange}
            >
                <ChoiceBoxItem id="pickup" textValue="Pickup Only">
                    <Store />
                    <ChoiceBoxLabel>Pickup Only</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This store does not offer delivery service; only pickup.</ChoiceBoxDescription>
                </ChoiceBoxItem>
                <ChoiceBoxItem id="delivery" textValue="Delivery & Pickup">
                    <Truck />
                    <ChoiceBoxLabel>Delivery & Pickup</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This store offers delivery as well as pickup.</ChoiceBoxDescription>
                </ChoiceBoxItem>
            </ChoiceBox>


            <AnimatePresence>
                {offersDelivery && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                    >
                        {!isAddingMethod && (errors?.shipping_info && "methods" in (errors.shipping_info as Record<string, unknown>) || (shippingMethods.length === 0)) && (
                            <div className={cn(
                                "text-sm border p-6 rounded-md text-center border-dashed",
                                errors?.shipping_info && "methods" in (errors.shipping_info as Record<string, unknown>)
                                    ? "text-red-500 border-red-500 bg-red-500/5"
                                    : "text-muted-foreground border-muted-foreground/50"
                            )}>
                                <p>
                                    {errors?.shipping_info && "methods" in (errors.shipping_info as Record<string, unknown>)
                                        ? (errors.shipping_info as Record<string, { message?: string }>)["methods"]?.message
                                        : "No configuraste ninguna forma de envío"
                                    }
                                </p>
                            </div>
                        )}
                        <AnimatePresence key={"inset"}>
                            {isAddingMethod && editingIndex !== null && shippingMethods[editingIndex!] && onCancelMethod && onSaveMethod && (
                                <ShippingMethodFormPanel
                                    method={shippingMethods[editingIndex!]}
                                    index={editingIndex!}
                                    onCancel={onCancelMethod}
                                    onSave={onSaveMethod}
                                />
                            )}
                        </AnimatePresence>

                        {shippingMethods.length > 0 && (
                            <div className="space-y-2">
                                {shippingMethods.map((m, i) => (
                                    (isAddingMethod && editingIndex === i) ? null : (
                                        <div key={i} className="flex justify-between items-center border rounded-md p-3 text-sm">
                                            <div className="space-y-1">
                                                <p className="font-medium">{m.providers.length ? m.providers.join(', ') : 'Sin proveedor seleccionado'}</p>
                                                <p className="text-muted-foreground">
                                                    {m.minPurchase ? `Mín compra: $${m.minPurchase}` : 'Sin mínimo'}
                                                    {" • "}
                                                    {m.freeShippingMin ? `Envío gratis desde: $${m.freeShippingMin}` : 'Sin gratis'}
                                                    {" • "}
                                                    {m.estimatedTime ? `ETA: ${m.estimatedTime}` : 'ETA no establecido'}
                                                    {m.deliveryPrice ? ` • Precio: $${m.deliveryPrice}` : ''}
                                                </p>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton type="button" icon={Trash} onClick={() => onDeleteMethod?.(i)} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Eliminar
                                                </TooltipContent>
                                            </Tooltip>
                                        </div>
                                    )
                                ))}
                            </div>
                        )}

                        {!isAddingMethod && (
                            <Button className="w-full" onClick={onAddMethod} type="button">
                                <Plus />
                                Agregar modo de envío
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

