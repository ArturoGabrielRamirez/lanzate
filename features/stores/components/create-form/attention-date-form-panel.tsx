import dayjs from "dayjs"
import { Calendar, Check } from "lucide-react"
import { useTranslations } from "next-intl"
import { FormProvider, useForm } from "react-hook-form"

import { InputField } from "@/features/global/components/form/input-field"
import { Button } from "@/features/shadcn/components/button"
import { Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle } from "@/features/shadcn/components/empty"
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/features/shadcn/components/item"
import { Badge } from "@/features/shadcn/components/ui/badge"
import { AttentionDateFormPanelProps } from "@/features/stores/types"
import { cn } from "@/lib/utils"

type FormValues = {
    days: string[]
    startTime: string
    endTime: string
}

export function AttentionDateFormPanel({ date, onCancel, onSave, index }: AttentionDateFormPanelProps) {
    const t = useTranslations("store.create-form.settings")
    
    const methods = useForm<FormValues>({
        defaultValues: {
            days: date.days || [],
            startTime: date.startTime ? (dayjs.isDayjs(date.startTime) ? date.startTime.format("HH:mm") : date.startTime) : "09:00",
            endTime: date.endTime ? (dayjs.isDayjs(date.endTime) ? date.endTime.format("HH:mm") : date.endTime) : "17:00"
        }
    })

    const { watch, setValue, handleSubmit } = methods
    const selectedDays = watch("days")
    
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
            setValue("days", current.filter(d => d !== day))
        } else {
            // Maintain order based on dayLabels
            const newSelection = [...current, day]
            newSelection.sort((a, b) => dayLabels.indexOf(a) - dayLabels.indexOf(b))
            setValue("days", newSelection)
        }
    }

    const handlePresetMonFri = () => {
        const monFri = dayLabels.slice(0, 5)
        setValue("days", monFri)
        setValue("startTime", "09:00")
        setValue("endTime", "18:00")
    }

    const handlePresetFriSun = () => {
        const friSun = dayLabels.slice(4, 7)
        setValue("days", friSun)
        setValue("startTime", "10:00")
        setValue("endTime", "17:00")
    }

    const onSubmit = (data: FormValues) => {
        const start = dayjs(`2000-01-01 ${data.startTime}`)
        const end = dayjs(`2000-01-01 ${data.endTime}`)
        onSave(index, start, end, data.days)
    }

    const handleCancel = () => {
        if (onCancel) onCancel(index)
    }

    return (
        <FormProvider {...methods}>
            <div className="flex flex-col gap-6 w-full border rounded-lg p-4">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">{t("operating-days-hours")}</h3>
                        <span className="text-sm text-muted-foreground">
                            {selectedDays.length} {selectedDays.length === 1 ? t("day-selected") : t("days-selected")}
                        </span>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handlePresetMonFri}
                            type="button"
                        >
                            {t("set-mon-fri")} (9AM-6PM)
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handlePresetFriSun}
                            type="button"
                        >
                            {t("set-fri-sun")} (10AM-5PM)
                        </Button>
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

                <div className="min-h-[100px]">
                    {selectedDays.length === 0 ? (
                        <Empty>
                            <EmptyMedia>
                                <Calendar className="size-10 text-muted-foreground" />
                            </EmptyMedia>
                            <EmptyContent>
                                <EmptyTitle>{t("select-days-above")}</EmptyTitle>
                                <EmptyDescription>{t("select-days-description")}</EmptyDescription>
                            </EmptyContent>
                        </Empty>
                    ) : (
                        <Item className="border rounded-md p-4">
                            <ItemContent className="gap-4">
                                <ItemHeader>
                                    <ItemTitle className="text-lg">
                                        {selectedDays.length > 0 ? selectedDays[0] : ""}
                                        {selectedDays.length > 1 && ` + ${selectedDays.length - 1} more`}
                                    </ItemTitle>
                                </ItemHeader>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <InputField
                                            name="startTime"
                                            label={t("start-time")} // Assuming translation exists or fallback
                                            type="time"
                                            placeholder="09:00"
                                            hideLabel
                                        />
                                    </div>
                                    <span className="text-sm text-muted-foreground">to</span>
                                    <div className="flex-1">
                                        <InputField
                                            name="endTime"
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

                <div className="flex gap-2 justify-end mt-2">
                    <Button variant="outline" onClick={handleCancel} type="button">
                        {t("cancel")}
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} type="button">
                        <Check className="mr-2 size-4" />
                        {t("save-schedule")}
                    </Button>
                </div>
            </div>
        </FormProvider>
    )
}
