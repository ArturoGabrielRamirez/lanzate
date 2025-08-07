"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SettingsFormContextType = {
    background_color: string
    background_foreground_color: string
    header_color: string
    header_foreground_color: string
    setBackgroundColor: (color: string) => void
    setBackgroundForegroundColor: (color: string) => void
    setHeaderColor: (color: string) => void
    setHeaderForegroundColor: (color: string) => void
}

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

type SettingsFormProviderProps = {
    children: ReactNode
    initialBackgroundColor?: string
    initialBackgroundForegroundColor?: string
    initialHeaderColor?: string
    initialHeaderForegroundColor?: string
}

function SettingsFormProvider({ 
    children, 
    initialBackgroundColor,
    initialBackgroundForegroundColor,
    initialHeaderColor,
    initialHeaderForegroundColor
}: SettingsFormProviderProps) {
    const [background_color, setBackgroundColor] = useState(initialBackgroundColor || "#ffffff")
    const [background_foreground_color, setBackgroundForegroundColor] = useState(initialBackgroundForegroundColor || "#000000")
    const [header_color, setHeaderColor] = useState(initialHeaderColor || "#ffffff")
    const [header_foreground_color, setHeaderForegroundColor] = useState(initialHeaderForegroundColor || "#000000")

    const value = {
        background_color,
        background_foreground_color,
        header_color,
        header_foreground_color,
        setBackgroundColor,
        setBackgroundForegroundColor,
        setHeaderColor,
        setHeaderForegroundColor
    }

    return (
        <SettingsFormContext.Provider value={value}>
            {children}
        </SettingsFormContext.Provider>
    )
}

function useSettingsForm() {
    const context = useContext(SettingsFormContext)
    if (context === undefined) {
        throw new Error("useSettingsForm must be used within a SettingsFormProvider")
    }
    return context
}

export { SettingsFormProvider, useSettingsForm } 