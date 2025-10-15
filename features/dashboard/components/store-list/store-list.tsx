import * as motion from "motion/react-client"

import { StoreListProps } from "@/features/dashboard/types"
import { StoreCard } from "@/features/stores/components"
import CreateStoreButtonNew from "@/features/stores/components/create-store-button-new"

function StoreList({ stores, userId }: StoreListProps) {
    return (
        <div className="md:grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4 flex overflow-x-auto md:overflow-x-visible">
            {stores.map((store) => (
                <motion.div className="relative group shrink-0 grow" key={store.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <StoreCard key={store.id} store={store} userId={userId} />
                </motion.div>
            ))}
            {stores.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center gap-2">
                    <p className="text-center text-sm text-muted-foreground">
                        No stores found
                    </p>
                    <CreateStoreButtonNew userId={userId} />
                </div>
            )}
        </div>
    )
}

export { StoreList }