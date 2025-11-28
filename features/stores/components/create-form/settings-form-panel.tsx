import { Calendar, Clock } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"

import { ChoiceBox, ChoiceBoxDescription, ChoiceBoxItem, ChoiceBoxLabel } from "@/features/shadcn/components/ui/choice-box"
import { AttentionDateFormPanel } from "@/features/stores/components/create-form/attention-date-form-panel"
import { useCreateStoreContext } from "@/features/stores/components/create-form/create-store-provider"
import { cn } from "@/lib/utils"

import type { Selection } from "react-aria-components"

export function SettingsFormPanel() {
    const t = useTranslations("store.create-form.settings")

    const { setValue, getValues, formState: { isValid, disabled } } = useFormContext()
    const { values, setValues: setCtxValues, setStepValid } = useCreateStoreContext()
    const { settings } = values

    const [isOpen24Hours, setIsOpen24Hours] = useState(settings?.is_open_24_hours ?? true)

    useEffect(() => {
        if (disabled) {
            setIsOpen24Hours(settings?.is_open_24_hours ?? true)
        }
    }, [disabled, settings?.is_open_24_hours])

    useEffect(() => {
        if (settings) {
            setValue("settings", settings)
            setIsOpen24Hours(settings.is_open_24_hours)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        setStepValid(5, isValid)
    }, [isValid, setStepValid])

    const handleIsOpen24Hours = () => {
        setIsOpen24Hours(true)
        setValue("settings.is_open_24_hours", true, { shouldValidate: true, shouldDirty: true })
        setValue("settings.attention_dates", [], { shouldValidate: true, shouldDirty: true })
        setCtxValues({
            ...values,
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
            ...values,
            settings: {
                is_open_24_hours: false,
                attention_dates: currentDates
            }
        })
    }

    const handleSelectionChange = (selection: Selection) => {
        if (selection === "all") return
        if (disabled) return
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
                    className={cn(disabled && "pointer-events-none")}
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
                        <AttentionDateFormPanel />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
