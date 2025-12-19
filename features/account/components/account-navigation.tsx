"use client"

import { User, Shield, CreditCard, AlertTriangle, Settings, Mail } from "lucide-react"
import * as motion from "motion/react-client"
import { useState, useEffect } from "react"

import { Item, ItemContent, ItemGroup, ItemMedia, ItemTitle } from "@/features/shadcn/components/item"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/features/shadcn/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function AccountNavigation() {
    const [activeValue, setActiveValue] = useState('account')

    const sections = [
        {
            icon: User,
            label: "Información",
            value: "account",
            shortcut: "1",
        },
        {
            icon: Shield,
            label: "Seguridad",
            value: "security",
            shortcut: "2",
        },
        {
            icon: CreditCard,
            label: "Membresía",
            value: "membership",
            shortcut: "3",
        },
        {
            icon: AlertTriangle,
            label: "Peligro",
            value: "danger-zone",
            shortcut: "4",
        },
        {
            icon: Settings,
            label: "Preferencias",
            value: "preferences",
            disabled: true
        },
        {
            icon: Mail,
            label: "Notificaciones",
            value: "notifications",
            disabled: true
        },
    ]

    const handleNavigation = (value: string) => {
        if (value === 'preferences' || value === 'notifications') return

        // Click en el tab correspondiente
        const tabButton = document.querySelector(`button[value="${value}"]`) as HTMLButtonElement
        tabButton?.click()
    }

    // Detectar tab activo usando useEffect para evitar SSR issues
    useEffect(() => {
        const getActiveTab = () => {
            const activeTab = document.querySelector('[role="tab"][aria-selected="true"]')
            return activeTab?.getAttribute('value') || 'account'
        }

        // Actualizar el estado inicial
        setActiveValue(getActiveTab())

        // Observer para cambios
        const observer = new MutationObserver(() => {
            setActiveValue(getActiveTab())
        })

        const tabsList = document.querySelector('[role="tablist"]')
        if (tabsList) {
            observer.observe(tabsList, {
                attributes: true,
                subtree: true,
                attributeFilter: ['aria-selected']
            })
        }

        return () => observer.disconnect()
    }, [])

    return (
        <ItemGroup className="grid @md:grid-cols-6 grid-cols-3 gap-4">
            {sections.map((section) => {
                const Icon = section.icon
                const isActive = activeValue === section.value

                return (
                    <Tooltip key={section.value}>
                        <TooltipTrigger asChild>
                            <motion.div
                                initial={{ scale: 0.95 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                                whileTap={{ scale: section.disabled ? 1 : 0.95 }}
                                whileHover={{ scale: section.disabled ? 1 : 1.05 }}
                            >
                                <Item
                                    variant="outline"
                                    className={cn(
                                        "p-2 group/item truncate aspect-square gap-1 bg-card opacity-50 transition-all duration-100 cursor-pointer",
                                        !section.disabled && "hover:opacity-100 hover:!bg-card hover:shadow-sm",
                                        isActive && "border-primary bg-primary/10 opacity-100 scale-105 shadow-sm",
                                        section.disabled && "cursor-not-allowed opacity-30"
                                    )}
                                    onClick={() => handleNavigation(section.value)}
                                >
                                    <ItemMedia
                                        variant="icon"
                                        className={cn(
                                            "mx-auto size-6 bg-transparent border-none text-muted-foreground transition-all duration-100 self-center",
                                            !section.disabled && "group-hover/item:text-primary group-hover/item:scale-125",
                                            isActive && "text-primary scale-125"
                                        )}
                                    >
                                        <Icon />
                                    </ItemMedia>
                                    {isActive && (
                                        <ItemContent className="truncate animate-in fade-in slide-in-from-bottom-1 duration-300 w-full">
                                            <ItemTitle className="font-medium text-xs text-foreground truncate text-center w-full block">
                                                {section.label}
                                            </ItemTitle>
                                        </ItemContent>
                                    )}
                                </Item>
                            </motion.div>
                        </TooltipTrigger>
                        <TooltipContent className="flex items-center gap-2">
                            <span>{section.label}</span>
                            {section.disabled && <span className="text-muted-foreground">(Próximamente)</span>}
                            {section.shortcut && !section.disabled && (
                                <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-muted border border-border rounded">
                                    {section.shortcut}
                                </kbd>
                            )}
                        </TooltipContent>
                    </Tooltip>
                )
            })}
        </ItemGroup>
    )
}