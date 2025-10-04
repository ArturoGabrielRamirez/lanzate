"use client"

import { Store, StoreOperationalSettings, Branch, BranchOperationalSettings, BranchOpeningHour } from "@prisma/client"
import { BasicInfoDisplay, AddressDisplay, ContactDisplay, SocialMediaDisplay, BranchesOverviewDisplay } from "./form-sections"

interface StoreInformationFormProps {
    store: Store & {
        operational_settings: StoreOperationalSettings | null
        branches: (Branch & { operational_settings: BranchOperationalSettings | null, opening_hours: BranchOpeningHour[] })[]
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
            <BranchesOverviewDisplay
                branches={store.branches as (Branch & { operational_settings: BranchOperationalSettings | null, opening_hours: BranchOpeningHour[] })[]}
                slug={store.slug}
            />
            {canManageStore && children}
        </>
    )
}

export default StoreInformationForm
