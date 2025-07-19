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
            {/* {store.branches.map((branch) => (
                <article key={branch.id} className="border border-border p-4 rounded-md">
                    <p className="flex items-center gap-2">
                        <House />
                        {branch.name}
                    </p>
                </article>
            ))} */}
            <BranchTable branches={store.branches} />
        </>
    )
}
export default BranchesTab