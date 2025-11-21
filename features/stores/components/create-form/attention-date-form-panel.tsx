import { TimePicker } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { Check, Trash } from "lucide-react"
import { useState } from "react"

import { Button } from "@/features/shadcn/components/button"
import AnimatedTags from "@/features/shadcn/components/smoothui/ui/AnimatedTags"
import { AttentionDateFormPanelProps } from "@/features/stores/types"

export function AttentionDateFormPanel({ date, onCancel, onSave, index }: AttentionDateFormPanelProps) {

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
