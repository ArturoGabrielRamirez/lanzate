"use client"

import { useState } from "react"
import StoreLogoEditor from "./store-logo-editor"
import { updateStoreLogo } from "../actions/updateStoreLogo"
import { toast } from "sonner"

type StoreLogoEditorWrapperProps = {
    currentLogo: string | null
    storeName: string
    storeId: number
}

function StoreLogoEditorWrapper({ currentLogo, storeName, storeId }: StoreLogoEditorWrapperProps) {
    const [logo, setLogo] = useState<string | null>(currentLogo)

    const handleLogoUpdate = async (newLogoUrl: string | null) => {
        try {
            // Update local state
            setLogo(newLogoUrl)

            // Update in database
            if (newLogoUrl) {
                toast.loading('Updating store logo...')
                const { error, message } = await updateStoreLogo(storeId, newLogoUrl)
                if (error) {
                    toast.dismiss()
                    toast.error(message)
                } else {
                    toast.dismiss()
                    toast.success(message)
                }
            }
        } catch (error) {
            console.error('Error updating store logo:', error)
            toast.error('Error updating store logo')
        }
    }

    return (
        <StoreLogoEditor
            currentLogo={logo}
            storeName={storeName}
            onLogoUpdate={handleLogoUpdate}
        />
    )
}

export default StoreLogoEditorWrapper
