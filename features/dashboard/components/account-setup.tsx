import { Settings } from "lucide-react"

import { AccountSetupCard } from "@/features/dashboard/components"

function AccountSetup() {
    return (
        <div className="area-[setup] hidden lg:block group/setup">
            <div className="flex items-center justify-between mb-2 md:mb-4">
                <h2 className="text-lg lg:text-2xl font-bold leading-6 flex items-center gap-2 text-primary/50 group-hover/setup:text-primary transition-all">
                    <Settings className="size-4 xl:size-5" />
                    Account Setup
                </h2>
            </div>
            <AccountSetupCard />
        </div>
    )
}

export { AccountSetup }