import { TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Calendar, Check, Plus, Trash } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

import { Button } from "@/features/shadcn/components/button"
import { IconButton } from "@/features/shadcn/components/shadcn-io/icon-button"
import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { AttentionDateFormPanelProps, AttentionDateType, CreateStoreFormValues } from "@/features/stores/types"

import type { Selection } from "react-aria-components"

function AttentionDateFormPanel({ date, onCancel, onSave, index }: AttentionDateFormPanelProps) {

    const initialTags = [
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",
        "domingo",
    ]

    const [selected, setSelected] = useState<string[]>(date.days || [])
    const [startTime, setStartTime] = useState<dayjs.Dayjs>(dayjs(date.startTime))
    const [endTime, setEndTime] = useState<dayjs.Dayjs>(dayjs(date.endTime))
    const format = 'HH:mm';

    const handleTimeChange = (value: (Dayjs | null)[] | null) => {
        if (!value || value.length !== 2) return
        const [start, end] = value
        setStartTime(dayjs(start))
        setEndTime(dayjs(end))
    }

    const handleCancel = () => {
        if (onCancel) onCancel(index)
    }

    const handleSave = () => {
        if (onSave) onSave(index, startTime, endTime, selected)
    }

    return (
        <>
            <AnimatedTags
                initialTags={initialTags}
                selectedTags={selected}
                onChange={setSelected}
            />
            <div className="space-y-2">
                <p className="text-sm font-medium">Horarios de apertura</p>
                <TimePicker.RangePicker
                    defaultValue={[startTime, endTime]}
                    format={format}
                    popupClassName="!z-50"
                    rootClassName="!z-50 w-full"
                    changeOnScroll
                    hourStep={1}
                    minuteStep={5}
                    showNow
                    variant="outlined"
                    size="large"
                    className="!bg-transparent !text-primary-foreground !border-muted-foreground/50"
                    onChange={handleTimeChange}
                />
            </div>
            <div className="flex gap-2">
                <Button className="grow" type="button" onClick={handleCancel}>
                    <Trash />
                    Cancel
                </Button>
                <Button className="grow" type="button" onClick={handleSave}>
                    <Check />
                    Save
                </Button>
            </div>
        </>
    )
}

export function SettingsFormPanel() {

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

    const seededRefSettings = useRef(false)
    useEffect(() => {
        if (seededRefSettings.current) return
        seededRefSettings.current = true
        if (values.settings) setValue("settings", values.settings, { shouldValidate: true })
    }, [values.settings, setValue])

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
            <ChoiceBox
                columns={2}
                gap={2}
                selectionMode="single"
                selectedKeys={[isOpen24Hours ? "24hours" : "schedule"]}
                onSelectionChange={handleSelectionChange}
                className="mb-8"
            >
                <ChoiceBoxItem id="24hours" textValue="24 Hours">
                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="size-9">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 0 0 5.998 8.485M21 12a9 9 0 1 0-18 0m9-5v5m0 3h2a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h2m3-6v2a1 1 0 0 0 1 1h1m1-3v6"></path>
                    </svg>
                    <ChoiceBoxLabel>24 Hours</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This store is open 24 hours.</ChoiceBoxDescription>
                </ChoiceBoxItem>
                <ChoiceBoxItem id="schedule" textValue="Schedule">
                    <Calendar className="size-9" />
                    <ChoiceBoxLabel>Schedule</ChoiceBoxLabel>
                    <ChoiceBoxDescription>This store works on schedule.</ChoiceBoxDescription>
                </ChoiceBoxItem>
            </ChoiceBox>
            <AnimatePresence>
                {!isOpen24Hours && (
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100, position: "absolute" }}
                    >
                        {attentionDates.length === 0 && !isAddingDate && (
                            <div className="text-sm text-muted-foreground border border-muted-foreground/50 p-6 rounded-md text-center border-dashed">
                                <p>No hay dias de atencion configurados</p>
                            </div>
                        )}
                        {errors?.settings && "attention_dates" in (errors.settings as Record<string, unknown>) && (
                            <p className="text-sm text-red-500">{(errors.settings as Record<string, { message?: string }>)["attention_dates"]?.message || ""}</p>
                        )}
                        {isAddingDate && editingIndex !== null && attentionDates[editingIndex] && (
                            <AttentionDateFormPanel
                                date={attentionDates[editingIndex]}
                                key={`edit-${editingIndex}`}
                                onCancel={handleCancelDate}
                                onSave={handleSaveDate}
                                index={editingIndex}
                            />
                        )}
                        {attentionDates.length > 0 && (
                            <div className="space-y-2">
                                {attentionDates.map((d, i) => (
                                    (isAddingDate && editingIndex === i) ? null : (
                                        <div key={i} className="flex justify-between items-center border rounded-md p-3 text-sm">
                                            <div className="space-y-1">
                                                <p className="font-medium">{d.days.length ? d.days.join(', ') : 'Sin días seleccionados'}</p>
                                                <p className="text-muted-foreground">
                                                    {dayjs(d.startTime).format('HH:mm')} - {dayjs(d.endTime).format('HH:mm')}
                                                </p>
                                            </div>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <IconButton type="button" icon={Trash} onClick={() => handleDeleteDate(i)} />
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
                        {!isAddingDate && (
                            <Button className="w-full" onClick={handleAddDate} type="button">
                                <Plus />
                                Add date
                            </Button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
