"use client"

import { useSettingsForm } from "./settings-form-provider"

type StorePreviewProps = {
    children: React.ReactNode
}

function StorePreview({ children }: StorePreviewProps) {
    const { 
        background_color, 
        background_foreground_color, 
        header_color, 
        header_foreground_color,
        filter_background_color,
        filter_text_color
    } = useSettingsForm()
    console.log("🚀 ~ StorePreview ~ background_foreground_color:", background_foreground_color)

    return (
        <div
            style={{
                "--background": background_color,
                "--foreground": background_foreground_color,
                "--header": header_color,
                "--header-foreground": header_foreground_color,
                "--filter-background": filter_background_color,
                "--filter-text": filter_text_color,
            } as React.CSSProperties}
            className="bg-background rounded-lg overflow-hidden"
        >
            {children}
        </div>
    )
}

export default StorePreview