import { ArrowLeftRight, Banknote, Check, CircleQuestionMark, CreditCard, DollarSign, List, Percent, Plus, Tag, Trash2, Wallet2, X } from "lucide-react"
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
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Card, CardContent } from "@/features/shadcn/components/ui/card"

const paymentTypes = [
    {
        label: (
            <span className="flex items-center gap-2">
                <ArrowLeftRight />
                <span>Transferencia</span>
            </span>
        ), value: "transferencia"
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <Banknote />
                <span>Efectivo</span>
            </span>
        ), value: "efectivo"
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <Wallet2 />
                <span>Billetera Virtual</span>
            </span>
        ), value: "billetera_virtual"
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <CreditCard />
                <span>Crédito</span>
            </span>
        ), value: "credito"
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <CreditCard />
                <span>Débito</span>
            </span>
        ), value: "debito"
    },
    {
        label: (
            <span className="flex items-center gap-2">
                <CircleQuestionMark />
                <span>Otro</span>
            </span>
        ), value: "otro"
    },
]

export function PaymentMethodsFormPanel() {
    const t = useTranslations("store.create-form.payment")
    const { control, formState: { isValid, errors, disabled }, setValue, getValues, trigger, watch } = useFormContext<CreateStoreFormValues>()
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
        if (disabled) {
            setIsAddingMethod(false)
            setConfirmedIds(new Set())
        }
    }, [disabled])

    useEffect(() => {
        if (payment_info?.payment_methods) {
            setValue("payment_info.payment_methods", payment_info.payment_methods)
        }
    }, [])

    useEffect(() => {
        setStepValid(3, isValid)
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
    }, [fields.length, confirmedIds.size, fields, getValues])

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
        const updatedMethods = currentMethods.filter((_, i) => i !== index).map((method) => ({
            ...method,
            type: method.type as PaymentMethodData["data"]["type"]
        }))

        setCtxValues({
            ...values,
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

            const updatedMethods = currentMethods.map((method) => ({
                ...method,
                type: method.type as PaymentMethodData["data"]["type"]
            }))

            setCtxValues({
                ...values,
                payment_info: {
                    payment_methods: updatedMethods
                }
            })
        }
    }

    const handleMethodChange = (index: number, field: string, value: string | number) => {
        const currentMethods = getValues("payment_info.payment_methods") || []
        const updatedMethods = currentMethods.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: value, type: item.type as PaymentMethodData["data"]["type"] }
            }
            return item
        })

        setCtxValues({
            ...values,
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
                        <Card key={field.id}>
                            <CardContent>
                                <Item className="p-0">
                                    <ItemMedia>
                                        <CreditCard className="size-5 text-muted-foreground" />
                                    </ItemMedia>
                                    <ItemContent className="grow">
                                        <ItemHeader>
                                            <ItemTitle>
                                                <h3 className="text-sm font-medium">
                                                    {paymentMethods?.[index]?.name}
                                                </h3>
                                            </ItemTitle>
                                        </ItemHeader>
                                        <ItemDescription className="flex items-center gap-1">
                                            <span>{`${paymentMethods?.[index]?.commission_percent}%`}</span>
                                            <span>-</span>
                                            <span>{`$${paymentMethods?.[index]?.commission_amount}`}</span>
                                        </ItemDescription>
                                    </ItemContent>
                                    <ItemActions className="flex items-center gap-2">
                                        <Badge variant="outline">
                                            {methodType}
                                        </Badge>
                                        {!disabled && (
                                            <IconButton
                                                icon={Trash2}
                                                onClick={() => handleRemoveMethod(index)}
                                                color={[255, 0, 0]}
                                                className="text-destructive hover:bg-destructive/10 active:bg-destructive/20"
                                                tooltip="Eliminar"
                                            />
                                        )}
                                    </ItemActions>
                                </Item>
                            </CardContent>
                        </Card>
                    )
                }

                return (
                    <div key={field.id} className="flex gap-2 items-start w-full relative group flex-col">
                        <div className="flex-1 space-y-4 w-full">
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

                        <div className="flex gap-2 justify-end w-full">
                            <Button variant="destructive" onClick={() => handleRemoveMethod(index)}>
                                <X />
                                Cancelar
                            </Button>
                            <Button variant="default" onClick={() => handleConfirmMethod(index)} disabled={!isValid || !!errors?.payment_info?.payment_methods?.[index]?.name || !!errors?.payment_info?.payment_methods?.[index]?.type}>
                                <Check />
                                Guardar
                            </Button>
                        </div>
                    </div>
                )
            })}

            {!isAddingMethod && !disabled && (
                <Button variant="outline" onClick={handleAddMethod}>
                    <Plus />
                    Agregar nuevo
                </Button>
            )}
        </div>
    )
}

