import dayjs from "dayjs"
import { Calendar, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { useFormContext } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { AttentionDateFormPanelProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"

export function AttentionDateFormPanel({ onCancel, onSave, index }: AttentionDateFormPanelProps) {
    const t = useTranslations("store.create-form.settings")

    const { watch, setValue, getValues } = useFormContext()
    const baseName = `settings.attention_dates.${index}`
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

    const handleToggleDay = (day: string) => {
        const current = selectedDays || []
        if (current.includes(day)) {
            setValue(`${baseName}.days`, current.filter((d: string) => d !== day), { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        } else {
            // Maintain order based on dayLabels
            const newSelection = [...current, day]
            newSelection.sort((a, b) => dayLabels.indexOf(a) - dayLabels.indexOf(b))
            setValue(`${baseName}.days`, newSelection, { shouldDirty: true, shouldTouch: true, shouldValidate: true })
        }
    }

    const onSubmit = () => {
        // We don't need to pass data, it's already in the form
        // But we need to trigger the parent's save logic (which might update context)
        const values = getValues(baseName)
        // Ensure values are present (though they should be due to append)
        if (onSave && values) {
            // Convert dayjs objects if necessary? Schema expects strings. InputField returns strings (usually).
            // getValues returns what's in the store.
            // InputField type="time" updates with string "HH:mm".
            // So we should be good passing values directly or just letting onSave handle it.
            // The original onSave signature: (index, startTime (dayjs), endTime (dayjs), days)
            // We need to adapt or change onSave signature.
            // For minimal disruption to parent, let's parse back to dayjs if parent expects it,
            // OR better: update parent to accept strings or just read from form.

            // Let's stick to the contract for now to avoid breaking parent
            // But wait, parent expects Dayjs objects?
            // The schema says string.
            // SettingsFormPanel handleSaveDate expects Dayjs.
            // Let's import dayjs and convert.
            const start = dayjs(`2000-01-01 ${values.startTime}`)
            const end = dayjs(`2000-01-01 ${values.endTime}`)
            onSave(index, start, end, values.days)
        }
    }

    const handleCancelClick = () => {
        if (onCancel) onCancel(index)
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
                    <Empty className="gap-1">
                        <EmptyMedia>
                            <Calendar className="size-10 text-muted-foreground" />
                        </EmptyMedia>
                        <EmptyContent className="gap-1">
                            <EmptyTitle>{t("select-days-above")}</EmptyTitle>
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
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <InputField
                                        name={`${baseName}.startTime`}
                                        label={t("start-time")}
                                        type="time"
                                        placeholder="09:00"
                                        hideLabel
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
                                    />
                                </div>
                            </div>
                        </ItemContent>
                    </Item>
                )}
            </div>

            <div className="flex gap-2 justify-end">
                <Button variant="destructive" onClick={handleCancelClick} type="button">
                    {t("cancel")}
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Button
                                onClick={onSubmit}
                                type="button"
                                disabled={selectedDays.length === 0}
                            >
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
