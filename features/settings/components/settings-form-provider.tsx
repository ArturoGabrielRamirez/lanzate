"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type SettingsFormContextType = {
    background_color: string
    setBackgroundColor: (color: string) => void
}

const SettingsFormContext = createContext<SettingsFormContextType | undefined>(undefined)

type SettingsFormProviderProps = {
    children: ReactNode
    initialBackgroundColor?: string
}

function SettingsFormProvider({ children, initialBackgroundColor }: SettingsFormProviderProps) {
    const [background_color, setBackgroundColor] = useState(initialBackgroundColor || "#ffffff")

    const value = {
        background_color,
        setBackgroundColor
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