"use client"

import { useLocale } from "next-intl";
import { useEffect, useState } from "react"

import { isActiveRoute } from '@/features/header/utils';
import { Switch } from "@/features/shadcn/components/ui/switch"
import { usePathname } from "@/i18n/naviation"
import { cn } from "@/lib/utils"

function LanguageSwitch() {

    /* const changeLocale = useChangeLocale() */
    const currentLocale = useLocale()
    const pathname = usePathname()
    const isHome = isActiveRoute(pathname, "/")

    const [isChecked, setIsChecked] = useState(currentLocale !== "es")

    useEffect(() => {
        setIsChecked(currentLocale !== "es")
    }, [currentLocale])

    const handleChange = (nextChecked: boolean) => {
        setIsChecked(nextChecked)
        /* changeLocale(nextChecked ? "en" : "es") */
    }


    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <p className={cn("text-sm", !isHome && "text-foreground")}>ES</p>
            <Switch checked={isChecked} onCheckedChange={handleChange} className="cursor-pointer" />
            <p className={cn("text-sm", !isHome && "text-foreground")}>EN</p>
        </div>
    )
}

export { LanguageSwitch }