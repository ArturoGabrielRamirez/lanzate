import { getStoresFromSlug } from "../../actions/get-stores-from-slug.action"
import { getEmployeePermissions } from "../../../employees/actions/get-employee-permisions.action"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { BranchesTabProps } from "@/features/stores/types"
import BranchTable from "../branch-table"

async function BranchesTab({ slug }: BranchesTabProps) {

    const { payload: user, error: userError, message: userMessage } = await getUserInfo()

    if (userError || !user) {
        return console.log(userMessage)
    }

    // Get user info and employee permissions
    const [
        { payload: store, error: storeError },
        { payload: employeePermissions, error: permissionsError }
    ] = await Promise.all([
        getStoresFromSlug(slug),
        getEmployeePermissions(user.id, slug)
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
                userId={user.id} 
                slug={slug}
                employeePermissions={employeePermissions}
            />
        </>
    )
}

export default BranchesTab