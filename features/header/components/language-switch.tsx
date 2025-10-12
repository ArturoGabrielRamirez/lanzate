"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useChangeLocale, useCurrentLocale } from "@/locales/client"

function LanguageSwitch() {

    const changeLocale = useChangeLocale()
    const currentLocale = useCurrentLocale()

    const [isChecked, setIsChecked] = useState(currentLocale !== "es")

    useEffect(() => {
        setIsChecked(currentLocale !== "es")
    }, [currentLocale])

    const handleChange = (nextChecked: boolean) => {
        setIsChecked(nextChecked)
        changeLocale(nextChecked ? "en" : "es")
    }


    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <p className="text-sm">ES</p>
            <Switch checked={isChecked} onCheckedChange={handleChange} className="cursor-pointer"/>
            <p className="text-sm">EN</p>
        </div>
    )
}
export { LanguageSwitch }