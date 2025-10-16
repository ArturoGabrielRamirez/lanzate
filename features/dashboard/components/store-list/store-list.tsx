import * as motion from "motion/react-client"

import { StoreListProps } from "@/features/dashboard/types"
import { StoreCard } from "@/features/stores/components"

function StoreList({ stores, userId }: StoreListProps) {
    return (
        <div className="">
            {stores.map((store) => (
                <motion.div className="relative group shrink-0 grow" key={store.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <StoreCard key={store.id} store={store} userId={userId} />
                </motion.div>
            ))}
            {stores.length === 0 && (
                <motion.div className="relative group shrink-0 grow" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <StoreCard isEmpty={true} userId={userId} />
                </motion.div>
            )}
        </div>
    )
}

export { StoreList }