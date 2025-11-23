import dayjs from "dayjs"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useFormContext, useFieldArray } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { AttentionDateFormPanel } from "@/features/stores/components/create-form/attention-date-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { AttentionDateType } from "@/features/stores/types"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

export function SettingsFormPanel() {
    const t = useTranslations("store.create-form.settings")

    const { setValue, getValues, formState: { isValid, errors }, trigger, control } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const { settings } = values

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "settings.attention_dates"
    })

    const [isAddingDate, setIsAddingDate] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isOpen24Hours, setIsOpen24Hours] = useState(settings?.is_open_24_hours ?? true)

    useEffect(() => {
        if (settings) {
            setValue("settings", settings)
            setIsOpen24Hours(settings.is_open_24_hours)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setStepValid(4, isValid)
    }, [isValid, setStepValid])

    const handleIsOpen24Hours = () => {
        setIsOpen24Hours(true)
        setValue("settings.is_open_24_hours", true, { shouldValidate: true, shouldDirty: true })
        setValue("settings.attention_dates", [], { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            settings: {
                is_open_24_hours: true,
                attention_dates: []
            }
        })
    }

    const handleIsNotOpen24Hours = () => {
        setIsOpen24Hours(false)
        setValue("settings.is_open_24_hours", false, { shouldValidate: true, shouldDirty: true })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const currentDates = getValues("settings.attention_dates") as any[] || []
        setCtxValues({
            settings: {
                is_open_24_hours: false,
                attention_dates: currentDates
            }
        })
    }

    const handleAddDate = () => {
        const newDate = {
            days: [],
            startTime: dayjs('10:00', 'HH:mm').format('HH:mm'),
            endTime: dayjs('12:00', 'HH:mm').format('HH:mm')
        }

        append(newDate)
        setIsAddingDate(true)
        setEditingIndex(fields.length) // It will be the new last index
    }

    const handleCancelDate = (index: number) => {
        setIsAddingDate(false)
        remove(index)
        setEditingIndex(null)

        const oldDates = values.settings?.attention_dates || []
        const newDates = oldDates.filter((_, i) => i !== index)

        setCtxValues({
            settings: {
                ...(values.settings || { is_open_24_hours: false }),
                attention_dates: newDates
            }
        })
    }

    const handleSaveDate = (index: number, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, days: string[]) => {
        const updatedDate = {
            days,
            startTime: startTime.format("HH:mm"),
            endTime: endTime.format("HH:mm")
        }

        update(index, updatedDate)
        setIsAddingDate(false)
        setEditingIndex(null)

        const currentDates = getValues("settings.attention_dates") as { days: string[], startTime: string, endTime: string }[] || []

        const newDates = [...currentDates]
        newDates[index] = updatedDate

        setCtxValues({
            settings: {
                ...(values.settings || { is_open_24_hours: false }),
                attention_dates: newDates
            }
        })

        trigger("settings.attention_dates")
    }

    const handleDeleteDate = (index: number) => {
        remove(index)
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)

        const oldDates = values.settings?.attention_dates || []
        const newDates = oldDates.filter((_, i) => i !== index)

        setCtxValues({
            settings: {
                ...(values.settings || { is_open_24_hours: false }),
                attention_dates: newDates
            }
        })
    }

    const handleSelectionChange = (selection: Selection) => {
        if (selection === "all") return
        const selected = Array.from(selection)[0]
        if (selected === "24hours") {
            handleIsOpen24Hours()
        } else if (selected === "schedule") {
            handleIsNotOpen24Hours()
        }
    }

    // Helper to convert form data to AttentionDateType for the form panel
    const getAttentionDateForPanel = (index: number): AttentionDateType => {
        const dateData = getValues(`settings.attention_dates.${index}`)
        // Fallback or default if creating new
        return {
            date: dayjs().format("YYYY-MM-DD"), // This field seems unused in display but required by type
            days: dateData?.days || [],
            startTime: dateData?.startTime ? dayjs(dateData.startTime, "HH:mm") : dayjs('10:00', 'HH:mm'),
            endTime: dateData?.endTime ? dayjs(dateData.endTime, "HH:mm") : dayjs('12:00', 'HH:mm'),
        }
    }

    return (
        <>
            <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">{t("attention-type")}</p>
                <ChoiceBox
                    columns={2}
                    gap={4}
                    selectionMode="single"
                    selectedKeys={[isOpen24Hours ? "24hours" : "schedule"]}
                    onSelectionChange={handleSelectionChange}
                >
                    <ChoiceBoxItem id="24hours" textValue={t("24-hours")}>
                        <Clock className="size-9" />
                        <ChoiceBoxLabel>{t("24-hours")}</ChoiceBoxLabel>
                        <ChoiceBoxDescription>{t("24-hours-description")}</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                    <ChoiceBoxItem id="schedule" textValue={t("schedule")}>
                        <Calendar className="size-9" />
                        <ChoiceBoxLabel>{t("schedule")}</ChoiceBoxLabel>
                        <ChoiceBoxDescription>{t("schedule-description")}</ChoiceBoxDescription>
                    </ChoiceBoxItem>
                </ChoiceBox>
            </div>
            <AnimatePresence>
                {!isOpen24Hours && (
                    <motion.div
                        className="flex flex-col gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                    >
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
                            <AttentionDateFormPanel
                                date={getAttentionDateForPanel(editingIndex)}
                                key={`edit-${editingIndex}`}
                                onCancel={handleCancelDate}
                                onSave={handleSaveDate}
                                index={editingIndex}
                            />
                        )}

                        {!isAddingDate && (
                            <Button className="w-full" onClick={handleAddDate} type="button" variant="outline">
                                <Plus />
                                {t("add-date")}
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
