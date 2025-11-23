import { TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Check, Trash } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/features/shadcn/components/button"
import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import { AttentionDateFormPanelProps } from "@/features/stores/types"

export function AttentionDateFormPanel({ date, onCancel, onSave, index }: AttentionDateFormPanelProps) {
    const t = useTranslations("store.create-form.settings")

    const initialTags = [
        t("days.monday"),
        t("days.tuesday"),
        t("days.wednesday"),
        t("days.thursday"),
        t("days.friday"),
        t("days.saturday"),
        t("days.sunday"),
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
                isRequired
            />
            <div className="flex flex-col gap-4 justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">{t("opening-hours")}</p>
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
                        {t("cancel")}
                    </Button>
                    <Button className="grow" type="button" onClick={handleSave}>
                        <Check />
                        {t("save")}
                    </Button>
                </div>
            </div>
        </>
    )
}
