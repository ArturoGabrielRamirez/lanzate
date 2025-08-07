"use client"

import { useSettingsForm } from "./settings-form-provider"

function StorePreview() {
    const { background_color } = useSettingsForm()

    return (
        <div
            style={{
                "--background": background_color,
            } as React.CSSProperties}
            className="bg-background"
        >
            preview
        </div>
    )
}

export default StorePreview