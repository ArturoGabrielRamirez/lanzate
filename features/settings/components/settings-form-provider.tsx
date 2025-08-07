"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SettingsFormContextType = {
    background_color: string
    background_foreground_color: string
    setBackgroundColor: (color: string) => void
    setBackgroundForegroundColor: (color: string) => void
}

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

type SettingsFormProviderProps = {
    children: ReactNode
    initialBackgroundColor?: string
    initialBackgroundForegroundColor?: string
}

function SettingsFormProvider({ 
    children, 
    initialBackgroundColor,
    initialBackgroundForegroundColor 
}: SettingsFormProviderProps) {
    const [background_color, setBackgroundColor] = useState(initialBackgroundColor || "#ffffff")
    const [background_foreground_color, setBackgroundForegroundColor] = useState(initialBackgroundForegroundColor || "#000000")

    const value = {
        background_color,
        background_foreground_color,
        setBackgroundColor,
        setBackgroundForegroundColor
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