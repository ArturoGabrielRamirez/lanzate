"use client"

import { useSettingsForm } from "./settings-form-provider"

type StorePreviewProps = {
    children: React.ReactNode
}

function StorePreview({ children }: StorePreviewProps) {
    const { background_color } = useSettingsForm()

    return (
        <div
            style={{
                "--background": background_color,
            } as React.CSSProperties}
            className="bg-background rounded-lg overflow-hidden"
        >
            {children}
        </div>
    )
}

export default StorePreview