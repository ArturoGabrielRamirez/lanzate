import * as motion from "motion/react-client"

import { StoreListProps } from "@/features/dashboard/types"
import { StoreCard, NewStoreCard } from "@/features/stores/components"

function StoreList({ stores, userId }: StoreListProps) {
    return (
        <div className="grid grid-cols-2 gap-2">
            {stores.map((store) => (
                <motion.div className="relative group shrink-0 grow" key={store.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <StoreCard store={store} userId={userId} />
                </motion.div>
            ))}
            {stores.length === 0 && (
                <motion.div className="relative group shrink-0 grow">
                    <NewStoreCard userId={userId} variant="empty" />
                </motion.div>
            )}
            {stores.length > 0 && (
                <motion.div className="relative group shrink-0 grow">
                    <NewStoreCard userId={userId} variant="add-more" />
                </motion.div>
            )}
        </div>
    )
}

export { StoreList }