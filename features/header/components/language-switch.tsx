"use client"

import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useEffect, useState, useTransition } from "react"

import { isActiveRoute } from '@/features/header/utils';
import { Switch } from "@/features/shadcn/components/ui/switch"
import { usePathname, useRouter } from "@/i18n/naviation"
import { cn } from "@/lib/utils"

function LanguageSwitch() {

    const currentLocale = useLocale()
    const pathname = usePathname()
    const params = useParams()
    const [isPending, startTransition] = useTransition();
    const router = useRouter();


    const isHome = isActiveRoute(pathname, "/")

    const [isChecked, setIsChecked] = useState(currentLocale !== "es")

    useEffect(() => {
        setIsChecked(currentLocale !== "es")
    }, [currentLocale])

    const handleChange = (nextChecked: boolean) => {
        startTransition(() => {
            setIsChecked(nextChecked)
            router.replace(
                // @ts-expect-error -- TypeScript will validate that only known `params`
                // are used in combination with a given `pathname`. Since the two will
                // always match for the current route, we can skip runtime checks.
                { pathname, params },
                { locale: nextChecked ? "en" : "es", scroll: false }
            )
        })
    }


    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <p className={cn("text-sm", !isHome && "text-foreground")}>ES</p>
            <Switch checked={isChecked} onCheckedChange={handleChange} className="cursor-pointer" disabled={isPending} />
            <p className={cn("text-sm", !isHome && "text-foreground")}>EN</p>
        </div>
    )
}

export { LanguageSwitch }