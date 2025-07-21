import CreateBranchButton from "@/features/branches/components/create-branch-button"
import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import BranchTable from "../branch-table"
import { BranchesTabProps } from "@/features/stores/types"

async function BranchesTab({ slug }: BranchesTabProps) {

    const { payload: store, error } = await getStoresFromSlug(slug)

    if (error || !store) {
        return console.log(error)
    }
    return (
        <>
            <div className="flex justify-end mb-4">
                <CreateBranchButton storeId={store.id} />
            </div>
            <BranchTable branches={store.branches} />
        </>
    )
}
export default BranchesTab