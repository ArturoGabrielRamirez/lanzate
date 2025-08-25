"use client"

import { Store, StoreOperationalSettings, Branch } from "@prisma/client"
import { BasicInfoDisplay, AddressDisplay, ContactDisplay, SocialMediaDisplay, OperationalSettingsDisplay } from "./form-sections"

interface StoreInformationFormProps {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
        branches: Branch[]
    }
    canManageStore?: boolean
    children?: React.ReactNode
    userId: number
}

const StoreInformationForm = ({
    store,
    canManageStore = false,
    children,
    userId
}: StoreInformationFormProps) => {

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BasicInfoDisplay
                    store={store}
                    userId={userId}
                />
                <AddressDisplay
                    store={store}
                    userId={userId}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContactDisplay store={store} />
                <SocialMediaDisplay
                    store={store}
                />
            </div>
            <OperationalSettingsDisplay
                store={store}
            />
            {canManageStore && children}
        </>
    )
}

export default StoreInformationForm
