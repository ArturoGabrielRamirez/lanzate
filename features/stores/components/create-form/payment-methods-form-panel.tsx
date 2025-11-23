import { Check, CreditCard, DollarSign, List, Percent, Plus, Tag, Trash2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { SelectField } from "@/features/global/components/form/select-field"
import { TextareaField } from "@/features/global/components/form/textarea-field"
import { Button } from "@/features/shadcn/components/button"
import { Empty, EmptyDescription } from "@/features/shadcn/components/empty"
import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/features/shadcn/components/ui/accordion"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { CreateStoreFormValues } from "@/features/stores/types"

const paymentTypes = [
    { label: "Transferencia", value: "transferencia" },
    { label: "Efectivo", value: "efectivo" },
    { label: "Billetera Virtual", value: "billetera_virtual" },
    { label: "Crédito", value: "credito" },
    { label: "Débito", value: "debito" },
    { label: "Otro", value: "otro" },
]

export function PaymentMethodsFormPanel() {
    const t = useTranslations("store.create-form.payment")
    const { control, formState: { isValid, errors }, setValue, getValues, trigger, watch } = useFormContext<CreateStoreFormValues>()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const { payment_info } = values

    const { fields, append, remove } = useFieldArray({
        control,
        name: "payment_info.payment_methods"
    })

    const [isAddingMethod, setIsAddingMethod] = useState(false)
    const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())

    const paymentMethods = watch("payment_info.payment_methods")

    useEffect(() => {
        if (payment_info?.payment_methods) {
            setValue("payment_info.payment_methods", payment_info.payment_methods)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setStepValid(5, isValid)
    }, [isValid, setStepValid])

    useEffect(() => {
        if (fields.length > 0 && confirmedIds.size === 0) {
            const newConfirmed = new Set<string>()
            const currentMethods = getValues("payment_info.payment_methods") || []

            fields.forEach((field, index) => {
                const methodData = currentMethods[index]
                if (methodData && methodData.name && methodData.type) {
                    newConfirmed.add(field.id)
                }
            })

            if (newConfirmed.size > 0) {
                setConfirmedIds(newConfirmed)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fields.length])

    const handleAddMethod = () => {
        append({
            name: "",
            type: "efectivo",
            commission_percent: undefined,
            commission_amount: undefined,
            cbu_cvu: "",
            alias: "",
            instructions: ""
        })
        setIsAddingMethod(true)
    }

    const handleRemoveMethod = (index: number) => {
        remove(index)
        setIsAddingMethod(false)

        const currentMethods = getValues("payment_info.payment_methods") || []
        const updatedMethods = currentMethods.filter((_, i) => i !== index)

        setCtxValues({
            payment_info: {
                payment_methods: updatedMethods
            }
        })
    }

    const handleConfirmMethod = async (index: number) => {
        const isValidField = await trigger(`payment_info.payment_methods.${index}`)
        if (isValidField) {
            const field = fields[index]
            if (field && field.id) {
                setConfirmedIds(prev => {
                    const next = new Set(prev)
                    next.add(field.id)
                    return next
                })
            }
            setIsAddingMethod(false)

            const currentMethods = getValues("payment_info.payment_methods") || []
            setCtxValues({
                payment_info: {
                    payment_methods: currentMethods
                }
            })
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleMethodChange = (index: number, field: string, value: any) => {
        const currentMethods = getValues("payment_info.payment_methods") || []
        const updatedMethods = currentMethods.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value }
            }
            return item
        })

        setCtxValues({
            payment_info: {
                payment_methods: updatedMethods
            }
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Métodos de pago</p>
            </div>

            {fields.length === 0 && !isAddingMethod && (
                <Empty className="border-dashed border-muted-foreground/50 border !py-2">
                    <EmptyDescription className="!text-xs">
                        <p>No hay métodos de pago configurados</p>
                    </EmptyDescription>
                </Empty>
            )}


            {fields.map((field, index) => {
                const isConfirmed = confirmedIds.has(field.id)
                const isCurrentAdding = isAddingMethod && index === fields.length - 1
                const methodType = paymentMethods?.[index]?.type
                
                if (isConfirmed && !isCurrentAdding) {
                    return (
                        <Item key={field.id} className="border rounded-md p-4 border-muted-foreground/50">
                            <ItemMedia>
                                <CreditCard className="size-5 text-muted-foreground" />
                            </ItemMedia>
                            <ItemContent>
                                <ItemHeader>
                                    <ItemTitle>{paymentMethods?.[index]?.name}</ItemTitle>
                                </ItemHeader>
                                <ItemDescription>
                                    {paymentTypes.find(t => t.value === methodType)?.label || methodType}
                                    {(paymentMethods?.[index]?.commission_percent || paymentMethods?.[index]?.commission_amount) && (
                                        <span className="ml-2 text-xs text-muted-foreground">
                                            ({paymentMethods?.[index]?.commission_percent ? `${paymentMethods?.[index]?.commission_percent}%` : ''}
                                            {paymentMethods?.[index]?.commission_percent && paymentMethods?.[index]?.commission_amount ? ' + ' : ''}
                                            {paymentMethods?.[index]?.commission_amount ? `$${paymentMethods?.[index]?.commission_amount}` : ''})
                                        </span>
                                    )}
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                                <IconButton
                                    icon={Trash2}
                                    onClick={() => handleRemoveMethod(index)}
                                    color={[255, 0, 0]}
                                    className="text-destructive hover:bg-destructive/10 active:bg-destructive/20"
                                    tooltip="Eliminar"
                                />
                            </ItemActions>
                        </Item>
                    )
                }

                return (
                    <div key={field.id} className="flex gap-2 items-start w-full relative group border rounded-lg p-4">
                        <div className="flex-1 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    name={`payment_info.payment_methods.${index}.name`}
                                    label="Nombre del método"
                                    placeholder="Nombre del método"
                                    disabled={isConfirmed && !isCurrentAdding}
                                    onChange={(e) => handleMethodChange(index, 'name', e.target.value)}
                                    startIcon={<Tag />}
                                    tooltip="El nombre del método se mostrará en el checkout"
                                />
                                <SelectField
                                    name={`payment_info.payment_methods.${index}.type`}
                                    label="Tipo de método"
                                    options={paymentTypes}
                                    placeholder="Seleccioná el tipo de método"
                                    disabled={isConfirmed && !isCurrentAdding}
                                    onChange={(value) => handleMethodChange(index, 'type', value)}
                                    startIcon={<List />}
                                    tooltip="El tipo de método se usará para identificar el método de pago"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    name={`payment_info.payment_methods.${index}.commission_percent`}
                                    label="(%) por transacción"
                                    placeholder="0"
                                    type="number"
                                    inputMode="decimal"
                                    disabled={isConfirmed && !isCurrentAdding}
                                    onChange={(e) => handleMethodChange(index, 'commission_percent', parseFloat(e.target.value))}
                                    startIcon={<Percent />}
                                    tooltip="La comisión se aplicará por transacción"
                                />
                                <InputField
                                    name={`payment_info.payment_methods.${index}.commission_amount`}
                                    label="($) por transacción"
                                    placeholder="0"
                                    type="number"
                                    inputMode="decimal"
                                    disabled={isConfirmed && !isCurrentAdding}
                                    onChange={(e) => handleMethodChange(index, 'commission_amount', parseFloat(e.target.value))}
                                    startIcon={<DollarSign />}
                                    tooltip="La comisión se aplicará por transacción"
                                />
                            </div>

                            {(methodType === 'transferencia' || methodType === 'billetera_virtual') && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InputField
                                        name={`payment_info.payment_methods.${index}.cbu_cvu`}
                                        label="CBU/CVU"
                                        placeholder={t("cbu-cvu-placeholder")}
                                        disabled={isConfirmed && !isCurrentAdding}
                                        onChange={(e) => handleMethodChange(index, 'cbu_cvu', e.target.value)}
                                    />
                                    <InputField
                                        name={`payment_info.payment_methods.${index}.alias`}
                                        label="Alias"
                                        placeholder="Alias"
                                        disabled={isConfirmed && !isCurrentAdding}
                                        onChange={(e) => handleMethodChange(index, 'alias', e.target.value)}
                                    />
                                </div>
                            )}

                            <Accordion type="single" collapsible className="w-full border-none">
                                <AccordionItem value="instructions" className="border-none">
                                    <AccordionTrigger className="text-sm font-medium py-2 hover:no-underline">
                                        Instrucciones adicionales
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <TextareaField
                                            name={`payment_info.payment_methods.${index}.instructions`}
                                            label=""
                                            placeholder="Instrucciones adicionales"
                                            disabled={isConfirmed && !isCurrentAdding}
                                            onChange={(e) => handleMethodChange(index, 'instructions', e.target.value)}
                                        />
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <div className="flex flex-col gap-2">
                            <IconButton
                                icon={Trash2}
                                onClick={() => handleRemoveMethod(index)}
                                color={[255, 0, 0]}
                                className="text-destructive hover:bg-destructive/10 active:bg-destructive/20"
                                tooltip="Eliminar"
                            />
                            <IconButton
                                icon={Check}
                                onClick={() => handleConfirmMethod(index)}
                                color={[0, 200, 0]}
                                className="text-green-600 hover:bg-green-600/10 active:bg-green-600/20"
                                tooltip="Confirmar"
                                disabled={!!errors?.payment_info?.payment_methods?.[index]}
                            />
                        </div>
                    </div>
                )
            })}

            {!isAddingMethod && (
                <Button variant="outline" onClick={handleAddMethod}>
                    <Plus />
                    Agregar nuevo
                </Button>
            )}
        </div>
    )
}

