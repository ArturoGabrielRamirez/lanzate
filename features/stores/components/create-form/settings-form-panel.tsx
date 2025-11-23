import dayjs from "dayjs"
import { Calendar, Plus, Trash } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { AttentionDateFormPanel } from "@/features/stores/components/create-form/attention-date-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { AttentionDateType, CreateStoreFormValues } from "@/features/stores/types"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

interface SettingsFormValues {
    is_open_24_hours: boolean
    attention_dates: { days: string[], startTime: string, endTime: string }[]
}

export function SettingsFormPanel() {
    const t = useTranslations("store.create-form.settings")

    const { setValue, getValues, formState: { isValid, errors }, watch, trigger } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const [attentionDates, setAttentionDates] = useState<AttentionDateType[]>(() => {
        const existing = getValues("settings.attention_dates") as { days: string[], startTime: string, endTime: string }[] | undefined
        if (!existing || existing.length === 0) return []
        return existing.map((d) => ({
            date: dayjs().format("YYYY-MM-DD"),
            days: d.days || [],
            startTime: dayjs(d.startTime, "HH:mm"),
            endTime: dayjs(d.endTime, "HH:mm"),
        }))
    })
    const [isAddingDate, setIsAddingDate] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isOpen24Hours, setIsOpen24Hours] = useState(() => !!(getValues("settings.is_open_24_hours") ?? true))

    const isOpen24HoursValue = watch("settings.is_open_24_hours")
    useEffect(() => {
        if (isOpen24HoursValue !== undefined) {
            setIsOpen24Hours(isOpen24HoursValue)
        }
    }, [isOpen24HoursValue])

    const attentionDatesValue = watch("settings.attention_dates")
    useEffect(() => {
        if (attentionDatesValue) {
            setAttentionDates(attentionDatesValue.map((d: { days: string[], startTime: string, endTime: string }) => ({
                date: dayjs().format("YYYY-MM-DD"),
                days: d.days || [],
                startTime: dayjs(d.startTime, "HH:mm"),
                endTime: dayjs(d.endTime, "HH:mm"),
            })))
        }
    }, [attentionDatesValue])

    const seededRefSettings = useRef(false)
    useEffect(() => {
        if (seededRefSettings.current) return
        seededRefSettings.current = true
        if (values.settings) setValue("settings", values.settings, { shouldValidate: true })
        setCtxValues({ settings: values.settings || { is_open_24_hours: true, attention_dates: [] } as SettingsFormValues })
    }, [values.settings, setValue, setCtxValues])

    useEffect(() => {
        const sub = watch((v) => setCtxValues({ settings: (v as CreateStoreFormValues).settings }))
        return () => sub.unsubscribe()
    }, [watch, setCtxValues])

    useEffect(() => { setStepValid(4, isValid) }, [isValid, setStepValid])
    const handleIsOpen24Hours = () => {
        setIsOpen24Hours(true)
        setValue("settings.is_open_24_hours", true, { shouldValidate: true, shouldDirty: true })
        setValue("settings.attention_dates", [], { shouldValidate: true, shouldDirty: true })
        trigger("settings")
    }

    const handleIsNotOpen24Hours = () => {
        setIsOpen24Hours(false)
        setValue("settings.is_open_24_hours", false, { shouldValidate: true, shouldDirty: true })
        // force validation when switching to scheduled mode
        setValue("settings.attention_dates", attentionDates.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        trigger("settings")
    }

    const handleAddDate = () => {

        const newDate: AttentionDateType = {
            date: dayjs().format("YYYY-MM-DD"),
            startTime: dayjs('10:00', 'HH:mm'),
            endTime: dayjs('12:00', 'HH:mm'),
            days: []
        }

        const newIndex = attentionDates.length
        setAttentionDates([...attentionDates, newDate])
        setIsAddingDate(true)
        setEditingIndex(newIndex)
    }

    const handleCancelDate = (index: number) => {
        setIsAddingDate(false)
        const next = attentionDates.filter((_date, i) => i !== index)
        setAttentionDates(next)
        setValue("settings.attention_dates", next.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        setEditingIndex(null)
        trigger("settings")
    }

    const handleSaveDate = (index: number, startTime: dayjs.Dayjs, endTime: dayjs.Dayjs, days: string[]) => {
        const next = attentionDates.map((date, i) => i === index ? { ...date, startTime, endTime, days } : date)
        setAttentionDates(next)
        setValue("settings.attention_dates", next.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        setIsAddingDate(false)
        setEditingIndex(null)
        trigger("settings")
    }

    const handleDeleteDate = (index: number) => {
        const next = attentionDates.filter((_date, i) => i !== index)
        setAttentionDates(next)
        setValue("settings.attention_dates", next.map(d => ({
            days: d.days,
            startTime: dayjs(d.startTime).format("HH:mm"),
            endTime: dayjs(d.endTime).format("HH:mm"),
        })), { shouldValidate: true, shouldDirty: true })
        if (editingIndex !== null && index === editingIndex) setEditingIndex(null)
        trigger("settings")
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
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="size-9">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 0 0 5.998 8.485M21 12a9 9 0 1 0-18 0m9-5v5m0 3h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2m3-6v2a1 1 0 0 0 1 1h1m1-3v6"></path>
                        </svg>
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
                        {!isAddingDate && (errors?.settings && "attention_dates" in (errors.settings as Record<string, unknown>) || (attentionDates.length === 0 && !isAddingDate)) && (
                            <div className={cn(
                                "text-sm border p-6 rounded-md text-center border-dashed",
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
                        {attentionDates.length > 0 && (
                            <div className="space-y-2">
                                {attentionDates.map((d, i) => (
                                    (isAddingDate && editingIndex === i) ? null : (
                                        <div key={i} className="flex justify-between items-center border rounded-md p-3 text-sm">
                                            <div className="space-y-1">
                                                <p className="font-medium">{d.days.length ? d.days.join(', ') : t("no-days-selected")}</p>
                                                <p className="text-muted-foreground">
                                                    {dayjs(d.startTime).format('HH:mm')} - {dayjs(d.endTime).format('HH:mm')}
                                                </p>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton type="button" icon={Trash} onClick={() => handleDeleteDate(i)} />
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
                        {isAddingDate && editingIndex !== null && attentionDates[editingIndex] && (
                            <div className="grid md:grid-cols-2 gap-4">
                                <AttentionDateFormPanel
                                    date={attentionDates[editingIndex]}
                                    key={`edit-${editingIndex}`}
                                    onCancel={handleCancelDate}
                                    onSave={handleSaveDate}
                                    index={editingIndex}
                                />
                            </div>
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
