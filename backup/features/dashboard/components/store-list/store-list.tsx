import * as motion from "motion/react-client"

import { StoreListProps } from "@/features/dashboard/types"
import { StoreCard, NewStoreCard } from "@/features/stores/components"

function StoreList({ stores, userId, mandatoryAddMore = false }: StoreListProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {stores.map((store) => (
                <motion.div className="relative group shrink-0 grow h-full" key={store.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <StoreCard store={store} userId={userId} />
                </motion.div>
            ))}
            {stores.length === 0 && (
                <>
                    <motion.div className="relative group shrink-0 grow">
                        <NewStoreCard userId={userId} variant="empty" />
                    </motion.div>
                    <motion.div className="relative group shrink-0 grow">
                        <NewStoreCard userId={userId} variant="empty" />
                    </motion.div>
                </>
            )}
            {stores.length > 0 && stores.length < 2 && !mandatoryAddMore && (
                <motion.div className="relative group shrink-0 grow">
                    <NewStoreCard userId={userId} variant="add-more" />
                </motion.div>
            )}
            {mandatoryAddMore && (
                <motion.div className="relative group shrink-0 grow">
                    <NewStoreCard userId={userId} variant="add-more" />
                </motion.div>
            )}
        </div>
    )
}

export { StoreList }