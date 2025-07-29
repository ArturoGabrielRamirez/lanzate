"use client"

import { Switch } from "@/components/ui/switch"
import { useChangeLocale, useCurrentLocale } from "@/locales/client"

function LanguageSwitch() {

    const changeLocale = useChangeLocale()
    const currentLocale = useCurrentLocale()

    const handleChange = () => {
        changeLocale(currentLocale === "es" ? "en" : "es")
    }


    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <p className="text-sm">ES</p>
            <Switch checked={currentLocale !== "es"} onCheckedChange={handleChange} className="cursor-pointer"/>
            <p className="text-sm">EN</p>
        </div>
    )
}
export default LanguageSwitch