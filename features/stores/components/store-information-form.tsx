"use client"

import { Store, StoreOperationalSettings, Branch } from "@prisma/client"
import { BasicInfoDisplay, AddressDisplay, ContactDisplay, SocialMediaDisplay } from "./form-sections"

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
            <BasicInfoDisplay
                store={store}
                userId={userId}
            />
            <AddressDisplay
                store={store}
                userId={userId}
            />
            <ContactDisplay store={store} />
            <SocialMediaDisplay
                store={store}
            />
            {canManageStore && children}
        </>
    )
}

export default StoreInformationForm
