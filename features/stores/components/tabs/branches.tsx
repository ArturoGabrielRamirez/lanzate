import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { BranchesTabProps } from "@/features/stores/types"
import BranchTable from "../branch-table"

async function BranchesTab({ slug, userId }: BranchesTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }

    return (
        <>
            <BranchTable branches={store.branches} storeId={store.id} userId={userId} />
        </>
    )
}
export default BranchesTab