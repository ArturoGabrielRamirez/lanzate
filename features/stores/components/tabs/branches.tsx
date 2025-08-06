import { getStoresFromSlug } from "../../actions/getStoresFromSlug"
import { getEmployeePermissions } from "../../actions/getEmployeePermissions"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { BranchesTabProps } from "@/features/stores/types"
import BranchTable from "../branch-table"

async function BranchesTab({ slug, userId }: BranchesTabProps) {

    // Get user info and employee permissions
    const [
        { payload: user, error: userError, message: userMessage },
        { payload: store, error: storeError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getUserInfo(),
        getStoresFromSlug(slug),
        getEmployeePermissions(userId, slug)
    ])

    if (userError || !user) {
        return console.log(userMessage)
    }

    if (storeError || !store) {
        return console.log(storeError)
    }

    if (permissionsError || !employeePermissions) {
        return console.log("Error loading employee permissions")
    }

    return (
        <>
            <BranchTable 
                branches={store.branches} 
                storeId={store.id} 
                userId={userId} 
                slug={slug}
                employeePermissions={employeePermissions}
            />
        </>
    )
}

export default BranchesTab