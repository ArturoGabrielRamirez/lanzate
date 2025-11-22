import { Plus, Store, Truck, Trash } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { FieldErrors } from "react-hook-form"
import { useTranslations } from "next-intl"

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
    const t = useTranslations("store.create-form.shipping")
    
    return (
        <div className="flex flex-col gap-4">
            <ChoiceBox
                columns={2}
                gap={6}
                selectionMode="single"
                selectedKeys={[offersDelivery ? "delivery" : "pickup"]}
                onSelectionChange={onSelectionChange}
            >
                <ChoiceBoxItem id="pickup" textValue={t("pickup-only")}>
                    <Store />
                    <ChoiceBoxLabel>{t("pickup-only")}</ChoiceBoxLabel>
                    <ChoiceBoxDescription>{t("pickup-only-description")}</ChoiceBoxDescription>
                </ChoiceBoxItem>
                <ChoiceBoxItem id="delivery" textValue={t("delivery-pickup")}>
                    <Truck />
                    <ChoiceBoxLabel>{t("delivery-pickup")}</ChoiceBoxLabel>
                    <ChoiceBoxDescription>{t("delivery-pickup-description")}</ChoiceBoxDescription>
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
                                        : t("no-shipping-configured")
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
                                                <p className="font-medium">{m.providers.length ? m.providers.join(', ') : t("no-provider-selected")}</p>
                                                <p className="text-muted-foreground">
                                                    {m.minPurchase ? `${t("min-purchase")}: $${m.minPurchase}` : t("no-minimum")}
                                                    {" • "}
                                                    {m.freeShippingMin ? `${t("free-shipping-min")}: $${m.freeShippingMin}` : t("no-free-shipping")}
                                                    {" • "}
                                                    {m.estimatedTime ? `ETA: ${m.estimatedTime}` : t("eta-not-set")}
                                                    {m.deliveryPrice ? ` • ${t("price")}: $${m.deliveryPrice}` : ''}
                                                </p>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton type="button" icon={Trash} onClick={() => onDeleteMethod?.(i)} />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    {t("delete")}
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
                                {t("add-shipping-method")}
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

