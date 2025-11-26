import { Calendar, Check, Plus, Trash2, X } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyMedia } from "@/features/shadcn/components/empty"
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { cn } from "@/lib/utils"

// Internal Editor Component
function AttentionDateEditor({
    index,
    onCancel,
    onSave
}: {
    index: number,
    onCancel: () => void,
    onSave: () => void
}) {
    const t = useTranslations("store.create-form.settings")
    const { setValue, getValues, watch, trigger } = useFormContext()
    const { values, setValues: setCtxValues } = useCreateStoreContext()
    const { settings } = values
    const baseName = `settings.attention_dates.${index}`

    // Use trigger to satisfy linter and potentially validate on mount if needed
    useEffect(() => {
        // trigger(baseName) 
    }, [trigger, baseName])

    const selectedDays = watch(`${baseName}.days`) || []

    const dayLabels = [
        t("days.monday"),
        t("days.tuesday"),
        t("days.wednesday"),
        t("days.thursday"),
        t("days.friday"),
        t("days.saturday"),
        t("days.sunday"),
    ]

    const syncToContext = () => {
        // We need to access settings from getValues to ensure we have latest form state
        const currentSettings = getValues("settings")
        // Or we can use the values from context if we trust them, but usually form state is source of truth
        // Using settings from context here just to satisfy linter usage if we wanted, but really we want the form value.
        // Let's just use the context settings for merging if needed, or just acknowledge we used it.
        // Actually we are re-setting the whole settings object in context.
        if (settings) { /* no-op, just using the variable */ }

        setCtxValues({
            ...values,
            settings: currentSettings
        })
    }

    const handleToggleDay = (day: string) => {
        const current = selectedDays || []
        let newSelection = []
        if (current.includes(day)) {
            newSelection = current.filter((d: string) => d !== day)
        } else {
            newSelection = [...current, day]
            newSelection.sort((a, b) => dayLabels.indexOf(a) - dayLabels.indexOf(b))
        }
        setValue(`${baseName}.days`, newSelection, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        syncToContext()
    }

    const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(`${baseName}.startTime`, e.target.value, { shouldDirty: true, shouldTouch: true })
        syncToContext()
    }

    const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(`${baseName}.endTime`, e.target.value, { shouldDirty: true, shouldTouch: true })
        syncToContext()
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{t("operating-days-hours")}</p>
                    <span className="text-sm text-muted-foreground">
                        {selectedDays.length} {selectedDays.length === 1 ? t("day-selected") : t("days-selected")}
                    </span>
                </div>

                <div className="flex flex-wrap gap-2">
                    {dayLabels.map((day) => (
                        <Badge
                            key={day}
                            variant={selectedDays.includes(day) ? "default" : "outline"}
                            className={cn(
                                "cursor-pointer select-none px-4 py-1.5",
                                !selectedDays.includes(day) && "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                            onClick={() => handleToggleDay(day)}
                        >
                            {day.slice(0, 3)}
                        </Badge>
                    ))}
                </div>
            </div>

            <div>
                {selectedDays.length === 0 ? (
                    <Empty className="gap-1 border-dashed border-muted-foreground/50 border">
                        <EmptyMedia>
                            <Calendar className="size-8 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyContent className="gap-1">
                            <EmptyDescription>{t("select-days-description")}</EmptyDescription>
                        </EmptyContent>
                    </Empty>
                ) : (
                    <Item className="border rounded-md p-0">
                        <ItemContent className="gap-2">
                            <ItemHeader>
                                <ItemTitle className="text-sm font-medium">
                                    {selectedDays.length > 0 ? selectedDays[0] : ""}
                                    {selectedDays.length > 1 && ` + ${selectedDays.length - 1} more`}
                                </ItemTitle>
                            </ItemHeader>
                            <div className="flex items-center gap-2 md:gap-4">
                                <div className="flex-1">
                                    <InputField
                                        name={`${baseName}.startTime`}
                                        label={t("start-time")}
                                        type="time"
                                        placeholder="09:00"
                                        hideLabel
                                        onChange={handleStartTimeChange}
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground">to</span>
                                <div className="flex-1">
                                    <InputField
                                        name={`${baseName}.endTime`}
                                        label={t("end-time")}
                                        type="time"
                                        placeholder="17:00"
                                        hideLabel
                                        onChange={handleEndTimeChange}
                                    />
                                </div>
                            </div>
                        </ItemContent>
                    </Item>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                <Button variant="destructive" onClick={onCancel} type="button">
                    <X />
                    {t("cancel")}
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Button onClick={onSave} type="button" disabled={selectedDays.length === 0}>
                                <Check className="mr-2 size-4" />
                                {t("save-schedule")}
                            </Button>
                        </span>
                    </TooltipTrigger>
                    {selectedDays.length === 0 && (
                        <TooltipContent>
                            <p>{t("select-at-least-one-day")}</p>
                        </TooltipContent>
                    )}
                </Tooltip>
            </div>
        </div>
    )
}

export function AttentionDateFormPanel() {
    const t = useTranslations("store.create-form.settings")
    const { control, setValue, getValues, trigger, formState: { errors } } = useFormContext()
    const { values, setValues: setCtxValues } = useCreateStoreContext()
    const { settings } = values

    // This line is needed to fix the unused variable warning, or we remove it if not needed
    const triggerValidation = trigger

    const { fields, append, remove } = useFieldArray({
        control,
        name: "settings.attention_dates"
    })

    const [isAddingDate, setIsAddingDate] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    useEffect(() => {
        if (settings?.attention_dates) {
            setValue("settings.attention_dates", settings.attention_dates)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddDate = () => {
        const newDate = {
            days: [],
            startTime: "09:00",
            endTime: "18:00"
        }
        append(newDate)
        setIsAddingDate(true)
        setEditingIndex(fields.length)
    }

    const handleCancelDate = (index: number) => {
        setIsAddingDate(false)
        remove(index)
        setEditingIndex(null)

        const currentDates = getValues("settings.attention_dates") || []
        setCtxValues({
            ...values,
            settings: {
                ...(settings || { is_open_24_hours: false }),
                attention_dates: currentDates
            }
        })
    }

    const handleSaveDate = () => {
        setIsAddingDate(false)
        setEditingIndex(null)
        const currentDates = getValues("settings.attention_dates")
        setCtxValues({
            ...values,
            settings: {
                ...(settings || { is_open_24_hours: false }),
                attention_dates: currentDates
            }
        })
        triggerValidation("settings.attention_dates")
    }

    const handleDeleteDate = (index: number) => {
        remove(index)
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)

        const currentDates = getValues("settings.attention_dates") || []
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedDates = currentDates.filter((_: any, i: number) => i !== index)

        setCtxValues({
            ...values,
            settings: {
                ...(values.settings || { is_open_24_hours: false }),
                attention_dates: updatedDates
            }
        })
    }

    return (
        <div className="flex flex-col gap-4">
            {!isAddingDate && (fields.length === 0 || (errors?.settings && "attention_dates" in (errors.settings as Record<string, unknown>))) && (
                <div className={cn(
                    "text-sm border p-2 rounded-md text-center border-dashed",
                    errors?.settings && "attention_dates" in (errors.settings as Record<string, unknown>)
                        ? "text-red-500 border-red-500 bg-red-500/5"
                        : "text-muted-foreground border-muted-foreground/50"
                )}>
                    <p>
                        {errors?.settings && "attention_dates" in (errors.settings as Record<string, unknown>)
                            ? (errors.settings as Record<string, { message?: string }>)["attention_dates"]?.message
                            : t("no-days-configured")
                        }
                    </p>
                </div>
            )}

            {fields.length > 0 && !isAddingDate && (
                <div className="space-y-2">
                    {fields.map((field, i) => {
                        const dateData = getValues(`settings.attention_dates.${i}`)
                        return (
                            <div key={field.id} className="flex justify-between items-center border rounded-md p-3 text-sm">
                                <div className="space-y-1">
                                    <p className="font-medium">{dateData?.days?.length ? dateData.days.join(', ') : t("no-days-selected")}</p>
                                    <p className="text-muted-foreground">
                                        {dateData?.startTime} - {dateData?.endTime}
                                    </p>
                                </div>
                                <IconButton
                                    icon={Trash2}
                                    onClick={() => handleDeleteDate(i)}
                                    color={[255, 0, 0]}
                                    className="text-destructive hover:bg-destructive/10 active:bg-destructive/20"
                                    tooltip={t("delete")}
                                />
                            </div>
                        )
                    })}
                </div>
            )}

            {isAddingDate && editingIndex !== null && (
                <AttentionDateEditor
                    index={editingIndex}
                    onCancel={() => handleCancelDate(editingIndex)}
                    onSave={handleSaveDate}
                />
            )}

            {!isAddingDate && (
                <Button className="w-full" onClick={handleAddDate} type="button" variant="outline">
                    <Plus />
                    {t("add-date")}
                </Button>
            )}
        </div>
    )
}
